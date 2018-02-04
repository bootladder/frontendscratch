package main

import (
	_ "hellobeego/routers"
	"hellobeego/controllers"
	"github.com/astaxie/beego"
)

func main() {
	beego.Router("/custom", &controllers.CustomController{}, "get:ListTasks")
	beego.Run()

}

