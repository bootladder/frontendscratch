package controllers

import (
	"github.com/astaxie/beego"
)

type WF0Controller struct {
	beego.Controller
}

func (c *WF0Controller) CreatePage() {
	c.Data["Website"] = "beego.me"
	c.Data["Email"] = "astaxie@gmail.com"
	c.TplName = "wf0.html"
	c.Render()
}
