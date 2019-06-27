module MessagePipe exposing (..)

import Html exposing (Html, button, div, text)
import Html.Attributes
import Html.Events exposing (onClick)
import Svg exposing (..)
import Svg.Attributes exposing (..)

type Msg
    = Noop

svgDie : Int -> Html msg
svgDie number =
    svg
        [ width "1000", height "100", viewBox "0 0 1000 100", fill "white", stroke "black", strokeWidth "3" ]
        (List.append
            [ rect [ x "1", y "1", width "1000", height "100", rx "15", ry "15" ] [] ]
            (listOfSvgs number)
        )


listOfSvgs : Int -> List (Svg msg)
listOfSvgs dieFace =
    case dieFace of
        1 ->
            [ circle [ cx "50", cy "50", r "10", fill "black" ] [] ]

        2 ->
            [ circle [ cx "25", cy "25", r "10", fill "black" ] []
            , circle [ cx "75", cy "75", r "10", fill "black" ] []
            ]

        _ ->
            [ circle [ cx "50", cy "50", r "10", fill "blue", stroke "none" ] []
            , circle [ cx "850", cy "50", r "10", fill "blue", stroke "none" ] []
            ]




