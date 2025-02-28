package config

// ServerConfig 服务器配置
type ServerConfig struct {
	Port int    `json:"port"`
	Mode string `json:"mode"`
}

// DatabaseConfig 数据库配置
type DatabaseConfig struct {
	Driver   string `json:"driver"`
	Host     string `json:"host"`
	Port     int    `json:"port"`
	Username string `json:"username"`
	Password string `json:"password"`
	DBName   string `json:"dbname"`
}

// Config 全局配置结构
type Config struct {
	Server   ServerConfig   `json:"server"`
	Database DatabaseConfig `json:"database"`
}

// DefaultConfig 默认配置
func DefaultConfig() *Config {
	return &Config{
		Server: ServerConfig{
			Port: 8888,
			Mode: "debug",
		},
		Database: DatabaseConfig{
			Driver:   "mysql",
			Host:     "localhost",
			Port:     3306,
			Username: "root",
			Password: "yqc20040329",
			DBName:   "admin",
		},
	}
}
