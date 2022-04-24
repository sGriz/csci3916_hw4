# CSC3916 HW4

## Description:
A standard REST server (POST,GET,PUT,DELETE) using NodeJS/Express.

The React front-end can be found at: https://csc3916-hw5-gryzick.herokuapp.com/#/

The Movies API can be found at: https://csci3916-hw4-gryz.herokuapp.com/

## How-to:
The React website provides UI for the /signup and /signin routes in our web API. The Movies API can be queried using the postman collection included below. Movies can be saved by POSTing to the /movies route. PUT, DEL, and GET are routed under /movies/:id. All CRUD operations are protected by JWT authentication (the token is retrieved from /signin and stored in a .env). Calling a update/save on the /movies collection will perform a validation of the title, year, genre, and an array of three actors in a JSON object.

## POSTMAN:
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/c9ada6ea34ca9d5d50b2?action=collection%2Fimport#?env%5BjwtToken_env_gryzick%5D=W3sia2V5Ijoiand0X3Rva2VuIiwidmFsdWUiOiJ0b2tlbiBoZXJlIiwiZW5hYmxlZCI6dHJ1ZSwidHlwZSI6InRleHQiLCJzZXNzaW9uVmFsdWUiOiJKV1QuLi4iLCJzZXNzaW9uSW5kZXgiOjB9XQ==)

!! Check that the environment 'jwtToken_env_gryzick' is enabled in Postman. Postman needs to store 'jwt_token' from the '/signin' POST in an environment variable in order for jwt authentication to succeed. !!

## NEW:
/reviews queries in PostMan should validate the query param (?reviews=true) on /movies collection. Also, /reviews and /reviews/:id allows for GET on all reviews and specific movie titles. POST only works with JWT Authentication, and must include a quote and rating. The rating must be an integer value between 0 and 5 ("stars"). Reviews can only be created if the movie title exists in the /movies database. Username is attached to each review. /reviews and /movies are separate entities.
## MongoDB Atlas:
![5 movies in the database](assets/db_info.JPG)
