# spark-project

Using NodeJS (Express.js framework) and MySQL database, implemented REST APIs which enable logged in users to manipulate with their own photos (get, add, update, delete, etc.).

### Prerequisites

XAMPP

Postman

# IMPORTANT ABOUT DOCKER

Docker doesn't connect to mysql correctly i think, because when I try to hit some route in postman (ex. /user/registration) it throws ECONNREFUSED error. It could be because I am using win 7 (unfortunately) and already had problems with docker before, or it could be because my_root_password in docker-compose.yml isn't correct or the code itself isn't completely correct (I'm guessing it's the latter)

## Tables used

Added db-tables.txt which contain SQL commands to create tables used in this project.

## Authors

* **Tomislav Lovrić** - [spark-project](https://github.com/Tomislav-lovric/spark-project)
