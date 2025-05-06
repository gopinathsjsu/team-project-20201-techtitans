# Team Name: TechTitans
Members: Nivedita Nair, Janice Park, Joel Zapana, Isla Shi
Meetings: Weekly over Discord 10:30AM

# Deployment Diagram and UML Class Diagram
For this project, we chose to do a MERN (MongoDB, Express, React, Node) stack and Amazon EC2
![deployment](https://github.com/user-attachments/assets/76a7bb1e-9c90-49ec-bdd9-4a1215a6c117)
![uml](https://github.com/user-attachments/assets/5e651b4a-65b8-48b6-96b9-1645e5460982)

# XP Core Values 
- **Feedback:** Every week we would hold not only a meeting to assign new tasks, but to reflect on our current work and what we could do to improve. Janice suggested each new implementation would need to be a pull request first, and one other person would have to do a proper code review before merging into main. During code reviews, we were honest with the quality of the code being published, and even with functioning code refactoring was encouraged to make the code readable for everyone else (for instance, the time display was repetitively programmed in the frontend and then turned into a reusable React component). 
- **Courage:** As a team we did not hesitate to speak up about organizational issues. We not only encouraged feedback (as mentioned before), but also made it clear when to stop any ineffective practices. We made sure to remind each other that code reviews were important, and that everyone had a chance to look at other's code without one or two members taking up too many reviews at a time. 

# [Link to Jira Board](https://sjsu-team-l8na8336.atlassian.net/jira/software/projects/TSS2/boards/1?atlOrigin=eyJpIjoiYjM4NmJiNDQ4M2FlNDM0MGIyMzJjODk4NDBhNjM4YjEiLCJwIjoiaiJ9)

# [Link to Weekly Scum Report with Burndown Charts](https://docs.google.com/document/d/10TecIwQSAHAxoNkJZ-cdLPTj3IGSpaliBixEp9wo9aw/edit?usp=sharing)

# How to run locally
Install dependencies first.
`npm i`

### Frontend
`cd frontend`
`npm run dev`

### Backend
`cd backend`
`npm run dev`

There are private variables inside a .env file not currently included in this repository that are needed to run. In addition, your device's IP address needs to be added to the MongoDB cluster's network. 
