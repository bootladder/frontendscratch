port module Main exposing (MessageDescriptor, Model, Msg(..), attribute, decodeValue, httpFetchMessages, init, main, path, queryDecoder, selectedIndex, subscriptions, svgDestination, svgMessage, svgMessagePipe, svgPipe, svgSender, text, update, view)

import Browser
import Html exposing (Attribute, Html, button, div, input, text)
import Html.Attributes
import Html.Events exposing (onClick, onInput)
import Http
import Json.Decode as Decode
import Json.Encode exposing (Value)
import MessagePipe exposing (..)
import Svg exposing (..)
import Svg.Attributes exposing (..)


main =
    Browser.element { init = init, update = update, view = view, subscriptions = subscriptions }



-- MODEL


type alias Model =
    { hello : String
    }


type alias MessageDescriptor =
    { sender : String
    , color : String
    , label : String
    }


init : Int -> ( Model, Cmd Msg )
init a =
    ( Model "uninint", httpFetchMessages "steve" "aaron" )



-- HTTP Request  (Query for Books)


httpFetchMessages : String -> String -> Cmd Msg
httpFetchMessages sender destination =
    Http.post
        { body =
            Http.jsonBody <|
                Json.Encode.object
                    [ ( "sender", Json.Encode.string sender )
                    , ( "destination", Json.Encode.string destination )
                    ]
        , url = "http://localhost:9002/audiomessageapi/query"
        , expect = Http.expectJson ReceivedMessageDescriptors queryDecoder
        }


queryDecoder : Decode.Decoder (List MessageDescriptor)
queryDecoder =
    Decode.list <|
        Decode.map3 MessageDescriptor
            (Decode.at [ "sender" ] Decode.string)
            (Decode.at [ "color" ] Decode.string)
            (Decode.at [ "label" ] Decode.string)



-- UPDATE


type Msg
    = Noop
    | Hello String
    | ReceivedMessageDescriptors (Result Http.Error (List MessageDescriptor))


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Noop ->
            ( model, Cmd.none )

        Hello str ->
            ( { model | hello = str }, Cmd.none )

        ReceivedMessageDescriptors result ->
            ( model, Cmd.none )


port selectedIndex : (Value -> msg) -> Sub msg


subscriptions : Model -> Sub Msg
subscriptions model =
    selectedIndex decodeValue


decodeValue : Value -> Msg
decodeValue x =
    let
        ( index, error ) =
            case Decode.decodeValue (Decode.field "hello" Decode.string) x of
                Ok s ->
                    ( s, False )

                Err _ ->
                    ( "bad", True )

        ( decodedPercent, error1 ) =
            case Decode.decodeValue (Decode.field "x" Decode.float) x of
                Ok i ->
                    ( i, False )

                Err _ ->
                    ( 0, True )

        ( decodedY, error2 ) =
            case Decode.decodeValue (Decode.field "y" Decode.float) x of
                Ok i ->
                    ( i, False )

                Err _ ->
                    ( 0, True )

        --        messageDescDecoder: Decoder MessageDesc
        --        messageDescDecoder =
        --            Decode.decodeValue (Decode.field "sender" Decode.string)
        --            JD.map3 Person
        --                (field "id" int)
        --                (field "name" string)
        --                (field "address" addressDecoder)
        --
        --        (somethingfromjson, error3) =
        --            case Decode.decodeValue (Decode.list messageDescDecoder) x of
        --                Ok i ->
        --                    ( "huuur", False )
        --
        --                Err _ ->
        --                    ( "duuur", True )
    in
    Hello index



-- VIEW


view : Model -> Html Msg
view model =
    let
        messageDesc =
            { sender = "steve"
            , color = "yellow"
            , label = "Z"
            }

        messageDescriptors =
            [ messageDesc, messageDesc ]
    in
    div [ class "elm-svg" ]
        [ div [ class "dice" ]
            [ text model.hello
            ]
        , div [ class "logicgates" ]
            []
        , div [ class "fractals" ]
            [ svgMessagePipe messageDescriptors
            ]
        ]


svgMessagePipe : List MessageDescriptor -> Html msg
svgMessagePipe messageDescriptors =
    let
        x_offsets =
            List.map ((*) 10) (List.range 1 (List.length messageDescriptors))

        desc_offset_tuples =
            List.map2 Tuple.pair messageDescriptors x_offsets
    in
    svg
        [ width "1000", height "100", viewBox "0 0 1000 100", fill "white", stroke "black", strokeWidth "3" ]
        (List.concat
            [ [ svgPipe
              , svgSender
              , svgDestination
              ]
            , List.foldl
                (\desc_offset_tuple msgs ->
                    let
                        messageDesc = (Tuple.first desc_offset_tuple)

                        x_offset =
                            (String.fromInt <| Tuple.second desc_offset_tuple) ++ "%"
                    in
                    List.append msgs [ svgMessage x_offset messageDesc ]
                )
                []
                desc_offset_tuples
            ]
        )


svgMessage x_offset messageDesc =
    svg
        [ width "100"
        , height "100%"
        , viewBox "0 0 300 300"
        , fill messageDesc.color
        , stroke "black"
        , strokeWidth "3"
        , x x_offset
        , y "0"
        ]
        [ svgPipe
        , svgSender
        , svgDestination
        , rect [ x "0", y "0", width "100%", height "100%", rx "1", ry "1" ] []
        , circle [ cx "50%", cy "50%", r "30%", fill "blue" ] []
        , text_ [ x "40%", y "60%", fontSize "90" ] [ text messageDesc.label ]
        ]


svgPipe =
    rect [ x "1", y "1", width "1000", height "100", rx "15", ry "15" ] []


svgSender =
    circle [ cx "50", cy "50", r "10", fill "blue", stroke "none" ] []


svgDestination =
    circle [ cx "850", cy "50", r "10", fill "blue", stroke "none" ] []


attribute =
    Html.Attributes.attribute


text =
    Svg.text


path =
    Svg.path
