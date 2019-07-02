port module Main exposing (MessageDescriptorResponseModel, MessageDescriptorViewModel, Model, Msg(..), attribute, filterMessagesFromUser, httpFetchMessages, httpJsonString, init, main, messageDescriptorResponseModelDecoder, messageOrbs, path, playbackMessage, queryDecoder, responseModel2ViewModel, selectedIndex, subscriptions, svgDestination, svgMessage, svgMessagePipe, svgPipe, svgSender, text, update, view, viewMessageMetadata)

import Basics.Extra exposing (..)
import Browser
import Html exposing (Attribute, Html, button, div, input, text)
import Html.Attributes
import Html.Events exposing (onClick, onInput)
import Http
import Json.Decode as Decode exposing (..)
import Json.Decode.Pipeline as D
import Json.Encode exposing (Value)
import MessagePipe exposing (..)
import Svg exposing (..)
import Svg.Attributes exposing (..)
import Svg.Events exposing (..)


main =
    Browser.element { init = init, update = update, view = view, subscriptions = subscriptions }



-- MODEL


type alias Model =
    { hello : String
    , messageDescriptors : List MessageDescriptorViewModel
    , selectedMessage : Maybe MessageDescriptorViewModel
    , user : String
    }


type alias MessageDescriptorResponseModel =
    { id : String
    , topic : String
    , project : String
    , timestamp : Int
    , sender : String
    , destination : String
    , audioblobid : String
    , listenedto : Bool
    }


type alias MessageDescriptorViewModel =
    { id : String
    , sender : String
    , destination : String
    , color : String
    , shape : String
    , label : String
    , backgroundColor : String
    , backgroundType : String
    }


init : Int -> ( Model, Cmd Msg )
init a =
    ( Model "uninint" [] Nothing "steve", httpFetchMessages "steve" )



-- HTTP Request  (Query for Books)


httpJsonString : String -> String
httpJsonString username =
    Json.Encode.encode 0 <|
        Json.Encode.object
            [ ( "username", Json.Encode.string username )
            ]


httpFetchMessages : String -> Cmd Msg
httpFetchMessages username =
    Http.post
        { body =
            Http.multipartBody
                [ Http.stringPart "requestmodel" <| httpJsonString username
                ]
        , url = "http://localhost:9002/audiomessageapi/queryusermessages"
        , expect = Http.expectJson ReceivedMessageDescriptorResponseModel queryDecoder
        }


queryDecoder : Decode.Decoder (List MessageDescriptorResponseModel)
queryDecoder =
    Decode.list <| messageDescriptorResponseModelDecoder


messageDescriptorResponseModelDecoder : Decode.Decoder MessageDescriptorResponseModel
messageDescriptorResponseModelDecoder =
    succeed MessageDescriptorResponseModel
        |> D.optional "ID" Decode.string "haha"
        |> D.optional "topic" Decode.string "undef"
        |> D.optional "project" Decode.string "undef"
        |> D.optional "timestamp" Decode.int 999
        |> D.optional "sender" Decode.string "undef"
        |> D.optional "destination" Decode.string "undef"
        |> D.optional "audioblobid" Decode.string "undef"
        |> D.optional "listenedto" Decode.bool False


updateJsonBody : String -> String
updateJsonBody id =
    Json.Encode.encode 0 <|
        Json.Encode.object
            [ ( "audioblobid", Json.Encode.string id )
            , ( "listenedto", Json.Encode.bool True )
            ]


updateMessageDescriptorListenedToState : String -> Cmd Msg
updateMessageDescriptorListenedToState id =
    Http.post
        { body =
            Http.multipartBody
                [ Http.stringPart "requestmodel" <| updateJsonBody id
                ]
        , url = "http://localhost:9002/audiomessageapi/update"
        , expect = Http.expectJson ReceivedMessageDescriptorResponseModel queryDecoder
        }



-- UPDATE


type Msg
    = Noop
    | Hello String
    | ReceivedMessageDescriptorResponseModel (Result Http.Error (List MessageDescriptorResponseModel))
    | MessageOrbHovered MessageDescriptorViewModel
    | OrbClicked MessageDescriptorViewModel
    | UserSelectButtonClicked String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Noop ->
            ( model, Cmd.none )

        Hello str ->
            ( { model | hello = str }, Cmd.none )

        ReceivedMessageDescriptorResponseModel (Ok descriptors) ->
            let
                messageDescriptorViewModels =
                    List.map responseModel2ViewModel descriptors
            in
            ( { model | messageDescriptors = messageDescriptorViewModels }, Cmd.none )

        ReceivedMessageDescriptorResponseModel (Err (Http.BadBody s)) ->
            ( { model | hello = s }
            , Cmd.none
            )

        ReceivedMessageDescriptorResponseModel (Err _) ->
            ( { model | hello = "FAIL" }
            , Cmd.none
            )

        MessageOrbHovered messageDesc ->
            ( { model | hello = "blah" }, Cmd.none )

        OrbClicked messageDesc ->
            ( { model | selectedMessage = Just messageDesc }
            , Cmd.batch
                [ playbackMessage messageDesc.id
                , updateMessageDescriptorListenedToState messageDesc.id
                , httpFetchMessages "steve"
                ]
            )

        UserSelectButtonClicked user ->
            ( { model | user = user }, httpFetchMessages user )


responseModel2ViewModel : MessageDescriptorResponseModel -> MessageDescriptorViewModel
responseModel2ViewModel responsemodel =
    { id = responsemodel.audioblobid
    , sender = responsemodel.sender
    , destination = responsemodel.destination
    , color =
        if responsemodel.listenedto == False then
            "green"

        else
            "gray"
    , shape = "circle"
    , label = responsemodel.topic
    , backgroundColor = "gray"
    , backgroundType = "solid"
    }



-- VIEW HELPERS


filterMessagesFromUser : String -> List MessageDescriptorViewModel -> List MessageDescriptorViewModel
filterMessagesFromUser dest messages =
    List.filter (\message -> message.sender == dest) messages



-- VIEW


view : Model -> Html Msg
view model =
    div [ class "elm-svg" ]
        [ div [ class "dice" ]
            [ text model.hello
            ]
        , div [ class "elmuserlogin" ]
            [ text "Who are you?"
            , button
                [ Html.Events.onClick <| UserSelectButtonClicked "steve" ]
                [ text "Steve" ]
            , button
                [ Html.Events.onClick <| UserSelectButtonClicked "aaron" ]
                [ text "Aaron" ]
            , button
                [ Html.Events.onClick <| UserSelectButtonClicked "user1" ]
                [ text "User1" ]
            , button
                [ Html.Events.onClick <| UserSelectButtonClicked "user2" ]
                [ text "User2" ]
            ]
        , svg
            [ class "elmmessagepipes"
            , width "500"
            , height "500"
            , viewBox "0 0 1000 1000"
            , fill "white"
            , stroke "black"
            , strokeWidth "3"
            ]
            [ svgMessagePipe 0 model.user "aaron" <| filterMessagesFromUser "aaron" model.messageDescriptors
            , svgMessagePipe 30 model.user "user1" <| filterMessagesFromUser "user1" model.messageDescriptors
            , svgMessagePipe 60 model.user "user2" <| filterMessagesFromUser "user2" model.messageDescriptors
            , svgMessagePipe 90 model.user "steve" <| filterMessagesFromUser "steve" model.messageDescriptors
            ]
        , div [ class "elmmessagemetadata" ]
            [ viewMessageMetadata model.selectedMessage
            ]
        ]


svgMessagePipe : Int -> String -> String -> List MessageDescriptorViewModel -> Html Msg
svgMessagePipe angle myname yourname messageDescriptors =
    svg
        [ width "500"
        , height "80"
        , viewBox "0 0 1000 100"
        , fill "white"
        , stroke "black"
        , strokeWidth "3"
        , x "0"
        , y "0"
        , transform <|
            "translate( 90 "
                ++ String.fromInt angle
                ++ " )"
                ++ "rotate( "
                ++ String.fromInt angle
                ++ " 0 0)"
        ]
        (List.concat
            [ [ svgPipe
              , svgSender myname
              , svgDestination yourname
              ]
            , messageOrbs messageDescriptors
            ]
        )


messageOrbs : List MessageDescriptorViewModel -> List (Html Msg)
messageOrbs messageDescriptors =
    -- Pair the messageDescriptors with x_offsets
    let
        times10percent x =
            String.fromInt (x * 10) ++ "%"

        x_offsets =
            List.indexedMap (\index x -> times10percent (index + 2)) messageDescriptors

        desc_offset_tuples =
            List.map2 Tuple.pair x_offsets messageDescriptors
    in
    List.map (uncurry svgMessage) desc_offset_tuples


svgMessage x_offset messageDesc =
    svg
        [ width "10%"
        , height "100%"
        , viewBox "0 0 300 300"
        , fill messageDesc.backgroundColor
        , stroke "black"
        , strokeWidth "3"
        , x x_offset
        , y "0"
        ]
        [ rect [ x "0", y "0", width "100%", height "100%", rx "1", ry "1" ] []
        , circle
            [ cx "50%"
            , cy "50%"
            , Svg.Events.onClick <| OrbClicked messageDesc
            , Svg.Events.onMouseOver <| MessageOrbHovered messageDesc
            , Svg.Events.onMouseOut <| Hello "svg OUT"
            , r "30%"
            , fill messageDesc.color
            ]
            []
        , text_ [ x "40%", y "60%", fontSize "90" ] [ text messageDesc.label ]
        ]


svgPipe =
    rect [ x "1", y "1", width "1000", height "100", rx "15", ry "15" ] []


svgSender name =
    svg
        [ width "20%"
        , height "100%"
        , viewBox "0 0 300 300"
        , fill "gray"
        , stroke "black"
        , strokeWidth "3"
        , x "0"
        , y "0"
        ]
        [ rect [ x "0", y "0", width "100%", height "100%", rx "1", ry "1" ] []
        , circle
            [ cx "50%"
            , cy "50%"
            , Svg.Events.onClick <| Hello "svg clcked"
            , Svg.Events.onMouseOver <| Hello "svg OVER"
            , Svg.Events.onMouseOut <| Hello "svg OUT"
            , r "30%"
            , fill "brown"
            ]
            []
        , text_ [ x "40%", y "60%", fontSize "90" ] [ text name ]
        ]


svgDestination name =
    svg
        [ width "20%"
        , height "100%"
        , viewBox "0 0 300 300"
        , fill "gray"
        , stroke "black"
        , strokeWidth "3"
        , x "80%"
        , y "0"
        ]
        [ rect [ x "0", y "0", width "100%", height "100%", rx "1", ry "1" ] []
        , circle
            [ cx "50%"
            , cy "50%"
            , Svg.Events.onClick <| Hello "svg clcked"
            , Svg.Events.onMouseOver <| Hello "svg OVER"
            , Svg.Events.onMouseOut <| Hello "svg OUT"
            , r "30%"
            , fill "brown"
            ]
            []
        , text_ [ x "40%", y "60%", fontSize "90" ] [ text name ]
        ]


viewMessageMetadata : Maybe MessageDescriptorViewModel -> Html Msg
viewMessageMetadata maybemessage =
    case maybemessage of
        Just message ->
            div []
                [ text message.sender
                , text message.destination
                , text message.color
                , text message.label
                , text "REPLY WITH SAME PARAMS BUTTON"
                ]

        Nothing ->
            div [] [ text "nothing" ]


attribute =
    Html.Attributes.attribute


text =
    Svg.text


path =
    Svg.path


port selectedIndex : (Value -> msg) -> Sub msg


port playbackMessage : String -> Cmd a


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none
