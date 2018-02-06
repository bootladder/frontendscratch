package main

import (
	_ "hellobeego/routers"
	"hellobeego/controllers"
	"github.com/astaxie/beego"
)

func main() {
	beego.SetStaticPath("/css", "static/css")
	beego.SetStaticPath("/vendor", "static/vendor")
	beego.SetStaticPath("/app", "static/app")
	beego.Router("/custom", &controllers.CustomController{}, "get:ListTasks")
	beego.Router("/wf0", &controllers.WF0Controller{}, "get:CreatePage")
	beego.Run()

}

