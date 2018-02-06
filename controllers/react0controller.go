package controllers

import (
	"github.com/astaxie/beego"
)

type React0Controller struct {
	beego.Controller
}

func (c *React0Controller) CreatePage() {
	c.Data["Website"] = "beego.me"
	c.Data["Email"] = "astaxie@gmail.com"
	c.TplName = "react0.html"
	c.Render()
}
