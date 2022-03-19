config = {}
config.version = "0.0.7"
config.DB_USER = "dbuser"
config.DB_PASS = "*GbSC)E2JA3_9TTN\\T~S"
config.DB_NAME = "logging"

config.DEV = true
if (config.DEV) {
    config.REACT_HOSTNAME = "localhost:3000"
    config.DB_HOSTNAME = "localhost"
    config.DJANGO_HOSTNAME = "localhost"
}
else {
    config.DB_HOSTNAME = "35.241.131.83"
    config.DJANGO_HOSTNAME = "34.76.206.173"
}

module.exports = config