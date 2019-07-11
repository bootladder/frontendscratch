port module Main exposing (MessageDescriptorResponseModel, MessageDescriptorViewModel, Model, Msg(..), archiveButton, boundingRectangle, deleteButton, filterMessagesFromUser, httpDeleteMessage, httpFetchMessages, init, main, messageDescriptorResponseModelDecoder, messageOrbs, metadataButton, pixelRulerLength, playbackMessage, queryDecoder, replyButton, responseModel2ViewModel, selectedIndex, subscriptions, svgCenterOrb, svgDestination, svgMessagePipe, svgOrb, svgPipe, svgSender, text, update, updateJsonBody, updateMessageDescriptorListenedToState, view, viewMessageMetadata)

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


httpFetchMessages : String -> Cmd Msg
httpFetchMessages username =
    Http.post
        { body =
            Http.multipartBody
                [ Http.stringPart "requestmodel" <|
                    Json.Encode.encode 0 <|
                        Json.Encode.object
                            [ ( "username", Json.Encode.string username )
                            ]
                ]
        , url = "http://localhost:9002/audiomessageapi/queryusermessages"
        , expect = Http.expectJson ReceivedMessageDescriptorResponseModel queryDecoder
        }



-----------------


httpDeleteMessage : MessageDescriptorViewModel -> Cmd Msg
httpDeleteMessage messageDesc =
    Http.post
        { body =
            Http.multipartBody
                [ Http.stringPart "requestmodel" <|
                    Json.Encode.encode 0 <|
                        Json.Encode.object
                            [ ( "audioblobid", Json.Encode.string messageDesc.id )
                            ]
                ]
        , url = "http://localhost:9002/audiomessageapi/delete"
        , expect = Http.expectWhatever ReceivedDeleteResponse
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
        , expect = Http.expectWhatever ReceivedUpdateResponse
        }



-- UPDATE


type Msg
    = Noop
    | Hello String
    | ReceivedMessageDescriptorResponseModel (Result Http.Error (List MessageDescriptorResponseModel))
    | ReceivedUpdateResponse (Result Http.Error ())
    | MessageOrbHovered MessageDescriptorViewModel
    | OrbClicked MessageDescriptorViewModel
    | UserSelectButtonClicked String
    | ReplyButtonClicked MessageDescriptorViewModel
    | ArchiveButtonClicked MessageDescriptorViewModel
    | DeleteButtonClicked MessageDescriptorViewModel
    | ReceivedDeleteResponse (Result Http.Error ())


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Noop ->
            ( model, Cmd.none )

        Hello str ->
            ( { model | hello = str }, Cmd.none )

        ReceivedUpdateResponse (Ok _) ->
            ( model, httpFetchMessages "steve" )

        ReceivedUpdateResponse (Err _) ->
            ( { model | hello = "FAIL" }
            , Cmd.none
            )

        ReceivedDeleteResponse result ->
            case result of
                Ok _ ->
                    ( model, httpFetchMessages model.user )

                Err _ ->
                    ( model, httpFetchMessages model.user )

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
                ]
            )

        UserSelectButtonClicked user ->
            ( { model | user = user }, httpFetchMessages user )

        ReplyButtonClicked messageDesc ->
            ( { model | hello = "reply clicked" ++ messageDesc.sender }, Cmd.none )

        DeleteButtonClicked messageDesc ->
            ( { model | hello = "delete clicked" }, httpDeleteMessage messageDesc )

        ArchiveButtonClicked messageDesc ->
            ( { model | hello = "archive clicked" }, Cmd.none )


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
        [ pixelRuler
        , div [ class "dice" ]
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
            [ width "500"
            , height "500"
            ]
            [ boundingRectangle
            , svgMessagePipe 0 "A" "Z" [ testMessageDesc, testMessageDesc ]
            ]
        , svg
            [ class "elmmessagepipes"
            , width "500" --is actually 500px
            , height "500"
            ]
            [ boundingRectangle
            , svgMessagePipe 0 model.user "aaron" <| filterMessagesFromUser "aaron" model.messageDescriptors
            , svgMessagePipe 25 model.user "user1" <| filterMessagesFromUser "user1" model.messageDescriptors
            , svgMessagePipe 50 model.user "user2" <| filterMessagesFromUser "user2" model.messageDescriptors
            , svgMessagePipe 75 model.user "steve" <| filterMessagesFromUser "steve" model.messageDescriptors
            , svgCenterOrb model.user
            , viewMessageMetadata model.selectedMessage
            ]
        ]


svgMessagePipe : Int -> String -> String -> List MessageDescriptorViewModel -> Html Msg
svgMessagePipe angle myname yourname messageDescriptors =
    svg
        [ width "80%"
        , height "15%"
        , fill "white"
        , stroke "black"
        , strokeWidth "3"

           , transform <|
                   "rotate( "
                   ++ String.fromInt angle
                   ++ " 0 0)"
        ]
        (List.concat
            [ [ svgPipe messageDescriptors
              , svgSender myname
              , svgDestination yourname
              ]
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
    List.map (uncurry svgOrb) desc_offset_tuples


svgOrb : String -> MessageDescriptorViewModel -> Html Msg
svgOrb x_offset messageDesc =
    svg
        [ width "10%"
        , height "100%"
        , fill messageDesc.backgroundColor
        , stroke "black"
        , strokeWidth "3"
        , x x_offset
        , y "0"
        , Svg.Events.onClick <| OrbClicked messageDesc
        , Svg.Events.onMouseOver <| MessageOrbHovered messageDesc
        , Svg.Events.onMouseOut <| Hello "svg OUT"
        ]
        [ rect [ x "0", y "0", width "100%", height "100%", rx "1", ry "1" ] []
        , circle
            [ cx "50%"
            , cy "50%"
            , r "30%"
            , fill messageDesc.color
            ]
            []
        , text_
            [ x "40%"
            , y "60%"
            , fontSize "1em"

            --, Svg.Events.onClick <| OrbClicked messageDesc
            ]
            [ text messageDesc.label ]
        ]


svgPipe : List MessageDescriptorViewModel -> Svg Msg
svgPipe messages =
    svg
        [ width "100%"
        , height "40%"
        , y "30%"
        ]
        (List.concat
            [
                 [ rect
                    [ class "svgPipe"
                    , width "100%"
                    , height "100%"
                    ]
                    []
              ]
             ,messageOrbs messages
            ]
        )


svgCenterOrb : String -> Svg Msg
svgCenterOrb name =
    svg
        []
        [ circle
            [ cx "0"
            , cy "0"
            , Svg.Events.onClick <| Hello "svg clcked"
            , Svg.Events.onMouseOver <| Hello "svg OVER"
            , Svg.Events.onMouseOut <| Hello "svg OUT"
            , r "15%"
            , fill "brown"
            ]
            []
        ]


svgSender name =
    svg
        [ width "20%"
        , height "100%"
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
        , text_ [ x "40%", y "60%", fontSize "1em" ] [ text name ]
        ]


svgDestination name =
    svg
        [ width "20%"
        , height "100%"
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
        , text_ [ x "40%", y "60%", fontSize "1em" ] [ text name ]
        , boundingRectangle
        ]


viewMessageMetadata : Maybe MessageDescriptorViewModel -> Html Msg
viewMessageMetadata maybemessage =
    case maybemessage of
        Just message ->
            svg []
                [ svg
                    [ x "0"
                    , y "75%"
                    , height "25%"
                    ]
                    [ boundingRectangle
                    , svg
                        [ x "0%"
                        , y "0%"
                        , width "30%"
                        ]
                        [ replyButton message ]
                    , svg
                        [ x "33%"
                        , y "0%"
                        , width "30%"
                        ]
                        [ deleteButton message ]
                    , svg
                        [ x "66%"
                        , y "0%"
                        , width "30%"
                        ]
                        [ archiveButton message ]
                    , text_
                        [ x "0"
                        , y "75%"
                        , fontSize "2em"
                        ]
                        [ text "HURR" ]
                    ]
                ]

        Nothing ->
            svg
                [ x "0"
                , y "75%"
                , height "25%"
                ]
                [ boundingRectangle
                ]


replyButton message =
    metadataButton "REPLY" message ReplyButtonClicked


deleteButton message =
    metadataButton "DELETE" message DeleteButtonClicked


archiveButton message =
    metadataButton "ARCHIVE" message ArchiveButtonClicked


metadataButton textParam message cmd =
    svg
        [ height "100%"
        , viewBox "0 0 300 300"
        , fill "white"
        , class "metadatabutton"
        , Svg.Events.onClick <| cmd message
        , strokeWidth "3"
        , x "0%"
        , y "0"
        ]
        [ rect [ x "0", y "0", width "100%", height "100%", rx "1", ry "1" ] []
        , circle
            [ cx "50%"
            , cy "50%"
            , r "30%"
            , fill "brown"
            ]
            []
        , text_ [ x "30%", y "50%", fontSize "2em" ] [ text textParam ]
        ]


boundingRectangle =
    svg
        [ fill "white"
        , strokeWidth "5"
        , stroke "green"
        ]
        [ rect [ x "0", y "0", width "100%", height "100%" ] [] ]



-- DEBUG HELPER CRAP


pixelRulerLength len =
    div
        [ Html.Attributes.style "background-color" "red"
        , Html.Attributes.style "height" "2px"
        , Html.Attributes.style "width" len
        ]
        []


pixelRuler =
    div [ class "pixelruler" ]
        [ pixelRulerLength "10px"
        , pixelRulerLength "20px"
        , pixelRulerLength "30px"
        , pixelRulerLength "40px"
        , pixelRulerLength "50px"
        , pixelRulerLength "100px"
        , pixelRulerLength "200px"
        , pixelRulerLength "500px"
        ]


testMessageDesc =
    MessageDescriptorViewModel "id" "topic " "project " "timestamp" "S " "D " "audioblobid " "listenedto "


text =
    Svg.text


port selectedIndex : (Value -> msg) -> Sub msg


port playbackMessage : String -> Cmd a


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none
