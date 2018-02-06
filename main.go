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
	beego.SetStaticPath("/reactsite", "static/reactsite")
	beego.SetStaticPath("/static", "static/reactsite/static")
	beego.SetStaticPath("/", "static/reactsite")

	beego.BConfig.Listen.EnableHTTP = false
	beego.BConfig.Listen.EnableHTTPS = true
	beego.BConfig.Listen.HTTPSPort  = 8080
	beego.BConfig.Listen.HTTPSCertFile  = "conf/ssl.crt"
	beego.BConfig.Listen.HTTPSKeyFile  = "conf/ssl.key"

	beego.Router("/custom", &controllers.CustomController{}, "get:ListTasks")
	beego.Router("/wf0", &controllers.WF0Controller{}, "get:CreatePage")  			//angular
	beego.Router("/react0", &controllers.React0Controller{}, "get:CreatePage")  //react
	beego.Run()

}

