package middleware

import (
	"context"
	"strings"
	"time"
	"translate/admin/model"

	// "translate/admin/service"

	"github.com/cloudwego/hertz/pkg/app"
	"github.com/golang-jwt/jwt/v5"
)

// Claims JWT claims结构
type Claims struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

const (
	SecretKey     = "your-secret-key" // 在实际应用中应该从配置文件中读取
	TokenExpireIn = 24 * time.Hour
)

// GenerateToken 生成JWT token
func GenerateToken(user *model.User) (string, error) {
	claims := Claims{
		UserID:   user.ID,
		Username: user.Username,
		Role:     user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(TokenExpireIn)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(SecretKey))
}

// Auth 认证中间件
func Auth() app.HandlerFunc {
	return func(ctx context.Context, c *app.RequestContext) {
		auth := string(c.GetHeader("Authorization"))
		if auth == "" {
			c.JSON(401, map[string]interface{}{
				"code": 401,
				"msg":  "未授权访问",
			})
			c.Abort()
			return
		}

		parts := strings.SplitN(auth, " ", 2)
		if !(len(parts) == 2 && parts[0] == "Bearer") {
			c.JSON(401, map[string]interface{}{
				"code": 401,
				"msg":  "无效的认证格式",
			})
			c.Abort()
			return
		}

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(parts[1], claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(SecretKey), nil
		})

		if err != nil || !token.Valid {
			c.JSON(401, map[string]interface{}{
				"code": 401,
				"msg":  "无效的token",
			})
			c.Abort()
			return
		}

		// 将用户信息存储在上下文中
		c.Set("user_id", claims.UserID)
		c.Set("username", claims.Username)
		c.Set("role", claims.Role)

		c.Next(ctx)
	}
}

// RequireRole 角色验证中间件
func RequireRole(role string) app.HandlerFunc {
	return func(ctx context.Context, c *app.RequestContext) {
		userRole, exists := c.Get("role")
		if !exists || userRole.(string) != role {
			c.JSON(403, map[string]interface{}{
				"code": 403,
				"msg":  "权限不足",
			})
			c.Abort()
			return
		}
		c.Next(ctx)
	}
}
