package main

import (
	"context"
	"fmt"
	"translate/admin/config"
	"translate/admin/handler"
	"translate/admin/middleware"
	"translate/admin/model"
	"translate/admin/service"

	"github.com/cloudwego/hertz/pkg/app"
	"github.com/cloudwego/hertz/pkg/app/server"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	// 加载配置
	cfg := config.DefaultConfig()

	// 连接数据库
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		cfg.Database.Username,
		cfg.Database.Password,
		cfg.Database.Host,
		cfg.Database.Port,
		cfg.Database.DBName,
	)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database: " + err.Error())
	}

	// 添加数据库迁移
	if err := db.AutoMigrate(&model.User{}); err != nil {
		panic("failed to migrate database: " + err.Error())
	}

	// 初始化服务
	userService := service.NewUserService(db)
	userHandler := handler.NewUserHandler(userService)

	// 创建 Hertz 实例
	h := server.Default(server.WithHostPorts(fmt.Sprintf(":%d", cfg.Server.Port)))

	// 配置 CORS
	h.Use(func(ctx context.Context, c *app.RequestContext) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if string(c.Method()) == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next(ctx)
	})

	// 注册路由
	api := h.Group("/api")
	{
		// 认证相关接口
		auth := api.Group("/auth")
		{
			auth.POST("/login", userHandler.Login)
			auth.POST("/register", userHandler.Register)
		}

		// 用户相关接口
		users := api.Group("/users")
		users.Use(middleware.Auth()) // 添加认证中间件
		{
			users.GET("/list", middleware.RequireRole("admin"), userHandler.GetUserList) // 添加管理员角色验证
			users.GET("/:id", userHandler.GetUserByID)
			users.PUT("/:id", userHandler.UpdateUser)                                     // 新增更新用户接口
			users.DELETE("/:id", middleware.RequireRole("admin"), userHandler.DeleteUser) // 新增删除用户接口，仅管理员可用
		}
	}

	// 启动服务器
	h.Spin()
}
