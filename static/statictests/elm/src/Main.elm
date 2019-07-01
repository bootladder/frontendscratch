port module Main exposing (MessageDescriptorResponseModel, MessageDescriptorViewModel, Model, Msg(..), attribute, httpFetchMessages, httpJsonString, init, main, messageDescriptorResponseModelDecoder, messageOrbs, path, playbackMessage, queryDecoder, responseModel2ViewModel, selectedIndex, subscriptions, svgDestination, svgMessage, svgMessagePipe, svgPipe, svgSender, text, update, view, viewMessageMetadata)

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
    }


type alias MessageDescriptorResponseModel =
    { id : String
    , customtopic : String
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
    ( Model "uninint" [] Nothing, httpFetchMessages "steve" )



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
                [ Http.stringPart "requestmodel" <| httpJsonString "steve"
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
        |> D.optional "customtopic" Decode.string "undef"
        |> D.optional "project" Decode.string "undef"
        |> D.optional "timestamp" Decode.int 999
        |> D.optional "sender" Decode.string "undef"
        |> D.optional "destination" Decode.string "undef"
        |> D.optional "audioblobid" Decode.string "undef"
        |> D.optional "listenedto" Decode.bool False



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
            ( { model | selectedMessage = Just messageDesc }, playbackMessage 8 )

        UserSelectButtonClicked user ->
            ( model, httpFetchMessages "steve" )


responseModel2ViewModel : MessageDescriptorResponseModel -> MessageDescriptorViewModel
responseModel2ViewModel _ =
    { id = "100"
    , sender = "S"
    , destination = "A"
    , color = "green"
    , shape = "circle"
    , label = "L"
    , backgroundColor = "gray"
    , backgroundType = "solid"
    }



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
        , div [ class "elmmessagepipes" ]
            [ svgMessagePipe model.messageDescriptors
            ]
        , div [ class "elmmessagemetadata" ]
            [ viewMessageMetadata model.selectedMessage
            ]
        ]


svgMessagePipe : List MessageDescriptorViewModel -> Html Msg
svgMessagePipe messageDescriptors =
    svg
        [ width "500"
        , height "80"
        , viewBox "0 0 1000 100"
        , fill "white"
        , stroke "black"
        , strokeWidth "3"
        ]
        (List.concat
            [ [ svgPipe
              , svgSender "Steve"
              , svgDestination "Aaron"
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
        , fill messageDesc.color
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
            , fill messageDesc.backgroundColor
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


port playbackMessage : Int -> Cmd a


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none
