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
    Int


init : () -> ( Model, Cmd Msg )
init _ =
    ( 50, Cmd.none )



-- UPDATE


type Msg
    = Increment
    | Decrement
    | Slider String
    | Noop
    | Hover Int Float Float


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Noop ->
            ( model, Cmd.none )

        Increment ->
            ( model + 1, Cmd.none )

        Decrement ->
            ( model - 1, Cmd.none )

        Slider s ->
            case String.toInt s of
                Nothing ->
                    ( 1, Cmd.none )

                Just i ->
                    ( i, Cmd.none )

        Hover index x y ->
            ( index * 5, Cmd.none )


port selectedIndex : (Value -> msg) -> Sub msg


subscriptions : Model -> Sub Msg
subscriptions model =
    selectedIndex decodeValue


decodeValue : Value -> Msg
decodeValue x =
    let
        ( index, error ) =
            case Decode.decodeValue (Decode.field "index" Decode.int) x of
                Ok i ->
                    ( i, False )

                Err _ ->
                    ( 0, True )

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
    in
    if (error || error1 || error2) then
        Slider <| String.fromInt 99

    else
        Hover index decodedPercent decodedY



-- VIEW


view : Model -> Html Msg
view model =
    div [ class "elm-svg" ]
        [ div [ class "dice" ]
            [ 
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


