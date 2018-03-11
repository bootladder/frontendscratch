package main

import (
	_ "hellobeego/routers"
	"hellobeego/controllers"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context"
	"fmt"
)

var server_port int = 8089

func main() {
	beego.InsertFilter("/*", beego.BeforeStatic, RedirectHttp)  //catch all

	beego.SetStaticPath("/css", "static/css")
	beego.SetStaticPath("/vendor", "static/vendor")
	beego.SetStaticPath("/app", "static/app")
	beego.SetStaticPath("/reactsite", "static/reactsite")
	beego.SetStaticPath("/static", "static/reactsite/static")
	beego.SetStaticPath("/", "static/reactsite")

	beego.BConfig.Listen.EnableHTTP = true
	beego.BConfig.Listen.EnableHTTPS = true
	beego.BConfig.Listen.HTTPSPort  = server_port
	beego.BConfig.Listen.HTTPSCertFile  = "conf/ssl3.crt"
	beego.BConfig.Listen.HTTPSKeyFile  = "conf/ssl3.key"

	beego.Router("/custom", &controllers.CustomController{}, "get:ListTasks")
	beego.Router("/wf0", &controllers.WF0Controller{}, "get:CreatePage")  			//angular
	beego.Router("/react0", &controllers.React0Controller{}, "get:CreatePage")  //react
	beego.Router("/simplewebrtc", &controllers.SimpleWebRTCController{}, "get:CreatePage")  //react

	log("beego.Run()\n")
	beego.Run()

}

var RedirectHttp = func(ctx *context.Context) {
		log("RedirectHttp\n")
    if !ctx.Input.IsSecure() {
            // no need for an additional '/' between domain and uri
        url := fmt.Sprintf( "https://%s:%d%s" , ctx.Input.Domain() ,
									server_port , ctx.Input.URI() )
				log(url)
        ctx.Redirect(302, url)
    }
}

func log(a string) {
	fmt.Print(a)
}
