
# Dockerization of express app



## Lessons Learned

how to create docker image locally

how to run container from image

creating a network between containers to share resources b/w them

push local image to docker hub






## Run Locally


Clone the project

```bash
  git clone https://github.com/chitha-srinath/docker-todo-express-app
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`MONGODB_URI` ( below are steps to get docker image of mongodb and run in a container )

`MONGODB_DB`


## Roadmap

- pull mongo docker image from docker hub to locally
 ```bash  
docker pull mongo
```
- run downloaded mongo docker image in a container
 ```bash  
 docker run -d --name mongo-container -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=secret mongo
 ```
- u can check with this url outside of the container exposed
 ```bash  
mongodb://admin:secret@localhost:27017 
```
- create a docker network to share resources b/w containers 
 ```bash  
docker network create <network_name> (mongonetwork)
```
- run mongo image in a container using network
 ```bash  
 docker run -d --name mongo-container -p 27017:27017 --net mongonetwork -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=secret mongo
 ```

- generate image locally from dockerfile which we have from github clone or  download image of todo-express app by below command
 ```bash 
docker pull srinathchitha/express-todo:latest
 ```
- update the `MONGODB_URI` with below url in env file where ```mongo-container``` is the container where mongodb running instead of ```localhost```

 ```bash  
mongodb://admin:secret@mongo-container:27017 
```
- if u pull the image no need to  run the below command to create image with the tag name todo-express
 ```bash 
docker build -t todo-express -f dockerFile .
 ```

- run the below command to start of a container of generated image / pulled image
 ```bash
docker run --name express-todo -p 5555:5050 --env-file .env --net mongonetwork -d todo-express
 ```

- now u r ready to go to run the apis 


## API Reference

#### Get todos
```http
  GET /todos
```



#### Create todo

```http
  POST /todos
```

|   Payload Request | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `title`      | `string` | **Required**. |


#### Update todo

```http
  PUT /todos/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. id is mongodb ```ObjectId``` |

#### Delete todo

```http
  DELETE /todos/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. id is mongodb ```ObjectId``` |

