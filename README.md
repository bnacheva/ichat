# ichat
	A real-time chat application with Spring Boot and Angular

## Prerequisites
	- Java 8
	- Maven
	- NodeJS
	- Angular CLI
	
## Functional summary
	- The backend part is a Spring Boot application which exposes Rest API for login / logout feature. It does not use Spring security for authentication. 
	The login feature is only registering the user in the database (In memory database). 
	The backend enables STOMP messaging over Websocket to allow two-way communication between the backend and frontend.

	- The frontend part is an Angular application which has a simple login page where the user can connect to the chat room. 
	The chat room displays the list of connected users and once the user clicks on a user in the list, they can start to send / receive messages between each other in real time.
