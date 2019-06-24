port module Main exposing (..)

import Browser
import Html exposing (Attribute, Html, button, div, input, text)
import Html.Attributes
import Html.Events exposing (onClick, onInput)
import Json.Decode as Decode
import Json.Encode exposing (Value)
import Svg exposing (..)
import Svg.Attributes exposing (..)


main =
    Browser.element { init = init, update = update, view = view, subscriptions = subscriptions }



-- MODEL


type alias Model =
  { hello : String
  }



init : Int -> ( Model, Cmd Msg )
init a =
    ( Model "uninint", Cmd.none )



-- UPDATE


type Msg
    = Noop
    | Hello String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Noop ->
            ( model, Cmd.none )

        Hello str -> ({model | hello=str} , Cmd.none)


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



        messageDescDecoder: Decoder MessageDesc
        messageDescDecoder =
            Decode.decodeValue (Decode.field "sender" Decode.string)
            JD.map3 Person
                (field "id" int)
                (field "name" string)
                (field "address" addressDecoder)

        (somethingfromjson, error3) =
            case Decode.decodeValue (Decode.list messageDescDecoder) x of
                Ok i ->
                    ( "huuur", False )

                Err _ ->
                    ( "duuur", True )


    in
        Hello index



-- VIEW


view : Model -> Html Msg
view model =
    div [ class "elm-svg" ]
        [ div [ class "dice" ]
            [ 
             text  model.hello
            ]
        , div [ class "logicgates" ]
            [ 
            ]
        , div [ class "fractals" ]
            [
            ]
        ]


attribute =
    Html.Attributes.attribute


text =
    Svg.text


path =
    Svg.path


