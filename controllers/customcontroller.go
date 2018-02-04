package controllers

import (
	"github.com/astaxie/beego"
)

type CustomController struct {
	beego.Controller
}

func (c *CustomController) ListTasks() {
	c.Data["Website"] = "beego.me"
	c.Data["Email"] = "astaxie@gmail.com"
	c.TplName = "custom.tpl"
	c.Render()
}
