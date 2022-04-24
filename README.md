# CSC3916 HW3

## Description:
A standard REST server (POST,GET,PUT,DELETE) using NodeJS/Express.

The React front-end can be found at: https://csc3916-hw5-gryzick.herokuapp.com/#/

The Movies API can be found at: https://csci3916-hw3-gryz.herokuapp.com/

## How-to:
The React website provides UI for the /signup and /signin routes in our web API. The Movies API can be queried using the postman collection included below. Movies can be saved by POSTing to the /movies route. PUT, DEL, and GET are routed under /movies/:id. All CRUD operations are protected by JWT authentication (the token is retrieved from /signin and stored in a .env). Calling a update/save on the /movies collection will perform a validation of the title, year, genre, and an array of three actors in a JSON object.

## POSTMAN:
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/5a945e7031483cf1675c?action=collection%2Fimport#?env%5BHomework3_gryzick%5D=W3sia2V5Ijoiand0X3Rva2VuIiwidmFsdWUiOiJ0b2tlbiBoZXJlIiwiZW5hYmxlZCI6dHJ1ZSwidHlwZSI6InRleHQiLCJzZXNzaW9uVmFsdWUiOiJKV1QuLi4iLCJzZXNzaW9uSW5kZXgiOjB9XQ==)

Check that the environment 'Homework3_gryzick' is enabled in Postman. Postman needs to store 'jwt_token' from the '/signin' POST in an environment variable in order for jwt authentication to succeed.

## MongoDB Atlas:
![5 movies in the database](assets/db_info.JPG)
