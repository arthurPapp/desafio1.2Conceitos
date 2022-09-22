const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checksExistsUserRepositories(request, response, next) {
  const id = request.params.id;
  const { title, url, techs } = request.body;
 
  const repositoryIndex = repositories.findIndex((repository) => repository.id === id);
 
  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }
   const updatedRepository = {
    title,
    url,
    techs
  };
  if (!title) {
    updatedRepository.title=repositories[repositoryIndex].title
  }
  if (!url) {
    updatedRepository.url=repositories[repositoryIndex].url
  }
  if (!techs) {
    updatedRepository.techs=repositories[repositoryIndex].techs
  }

 
  request.updatedRepository = updatedRepository;
  request.repositoryIndex = repositoryIndex;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  // if (repositories.find((repository) => repository.title === title)) {
  //   return response.status(400).json({ error: "User already existis!" });
  // }
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository)

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checksExistsUserRepositories,(request, response) => {
  
  const {updatedRepository} = request;
  const { repositoryIndex } = request;
  
  const repository = { ...repositories[repositoryIndex], ...updatedRepository };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const  id  = request.params.id;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const  id  = request.params.id;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  

  const repository = repositories[repositoryIndex];
  const like = repository.likes+1;
  

  repositories[repositoryIndex].likes = like;
  return response.json({"likes": Number(like) });
});

//app.listen(8888)
module.exports = app;
