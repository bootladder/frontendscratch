package controllers

import (
	"github.com/astaxie/beego"
)

type SimpleWebRTCController struct {
	beego.Controller
}

func (c *SimpleWebRTCController) CreatePage() {
	c.Data["Website"] = "beego.me"
	c.Data["Email"] = "astaxie@gmail.com"
	c.TplName = "simplewebrtc.tpl"
	c.Render()
}
