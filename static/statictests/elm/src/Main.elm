port module Main exposing (Model, Msg(..), attribute, decodeValue, httpFetchMessages, init, main, path, queryDecoder, selectedIndex, subscriptions, text, update, view)

import Browser
import Html exposing (Attribute, Html, button, div, input, text)
import Html.Attributes
import Html.Events exposing (onClick, onInput)
import Json.Decode as Decode
import Json.Encode exposing (Value)
import MessagePipe exposing (..)
import Svg exposing (..)
import Svg.Attributes exposing (..)
import Http


main =
    Browser.element { init = init, update = update, view = view, subscriptions = subscriptions }



-- MODEL


type alias Model =
    { hello : String
    }


type alias MessageDescriptor =
    { sender: String
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
        Decode.map MessageDescriptor
            (Decode.at [ "title" ] Decode.string)



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

        ReceivedMessageDescriptors result -> ( model, Cmd.none )


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
        messageDesc ={ sender = "steve"}
    in
    div [ class "elm-svg" ]
        [ div [ class "dice" ]
            [ text model.hello
            ]
        , div [ class "logicgates" ]
            []
        , div [ class "fractals" ]
            [ svgDie 5
            , svgMessagePipe messageDesc
            ]
        ]

svgMessagePipe : MessageDescriptor -> Html msg
svgMessagePipe messageDesc = div [] []



attribute =
    Html.Attributes.attribute


text =
    Svg.text


path =
    Svg.path
