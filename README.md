### Demo
https://drive.google.com/file/d/1T-jsxp4j-slyDQ-tc1U6aXtf3OJq59oz/view?usp=sharing

### Figma
https://www.figma.com/design/kmQJ5mq7ieRbsI830CdxcO/Capstone-Mockups?node-id=1669-162202&t=0yZZimTkSUbpVez4-1

### About the Project
This code was written during my Fall 2024 Capstone course at Clemson. I learned so much about using objects in TS, managing state with NgRx, and reusable, responsive design. I've enjoyed being able to look back at what I implemented towards the beginning of the project and compare with to my work at the end, as I'm really proud of how I grew as a developer.

### Project Objectives
This is the frontend code for a construction-field project uses a generative AI solution to automate bid generation and track projects for potential cost overruns. The solution transforms the bid creation process from a manual, time-intensive task to an efficient, largely automated workflow requiring minimal user input. The chatbot feature assists here, allowing real-time news data to factor into price fluctuations and providing a second opinion for bid decisions. Once a bid is established, the project tracking feature provides insights into expected or recurring issues, helping teams manage costs proactively. 
### File Structure and Content Overview
- **app/**
  - Launchpad component for application
  - Renders sidebar component and router outlet 
  - Groups child components for lazy loading in app-routing.module
  - Imports modules used across the application
  - **bid-creation/**
    - Component responsible for gathering user input for bid creation
    - Renders the bid creation form
    - Sends user input to backend via ProjectsHttpService
    - Validates user input
    - Does not have a NgRx state instance
  - **dashboard/**
    - Renders key statistics and presents projects table and bid creation link via presentational projects table component
    - Pulls data from DashboardState
    - **redux/**
      - Contains DashboardState, a small state containing project previews
      - Could be refactored and absorbed into ProjectState, is currently separate to ensure separation of concerns
      - Contains actions pertaining to loading in project previews
      - Has an effect to call ProjectHttpService’s getAllPreviews function and map the results to a projects.model interface
      - Resolver ensures project previews are loaded before the dashboard route completes and the page is rendered
      - Doesn’t fetch from backend if project previews are already present in state to prevent unnecessary calls, leading to the dashboard needing to be reloaded to view updates
      - Could improve this by adding a detect preview update service that monitors a BehaviorSubject
  - **project/**
    - Parent component to modification and tracking components
    - Responsible for modification and tracking routes
    - Pulls data from and interacts with backend via ProjectState
    - **modification/**
      - Child component, uses ProjectState heavily to render and update project data
      - Renders generated bid details and enables user editing
      - Instantly responds to user edits
    - **tracking/**
      - Child component, makes use of ProjectState to render and update project data
      - Renders line chart (Chart.js)
    - **totals/**
      - Component responsible for displaying category sums and overage/underage alerts
      - Independent component used by modification and tracking due to similar logic and presentation requirements
      - Stored within project folder because of use of ProjectState for rendering and displaying up-to-date totals
      - Optional inputs of projectSpending and risk, used when project is in tracking mode, could be refactored to pull from ProjectState
    - **redux/**
      - Contains ProjectState, a large state containing an array of projects and an array of historical and risk data
      - Has actions for
        - Loading project details
        - Finalizing bids
        - Updating project details
        - Updating feature values
        - Updating overview values
        - Loading historical and risk data
      - Has effects to
        - Load historical and risk data via HistoricalHttpService
        - Call ProjectsHttpService and map results to a projects.model ProjectOverview and Project
        - Update bid statuses via ProjectsHttpService
        - Navigate to project tracking (side effect)
        - Update project details via ProjectsHttpService
      - Has many selectors for easy data access in components and a reducer to keep the state updated with user edits
  - **services/**
    - ChatbotHttpService
      - Contains the chatbot’s API route
    - HistoricalHttpService
      - API routes related to the tracking portion of the project
      - Wraps calls with auth token required by backend in prod
    - ProjectsHttpService
      - API routes related to project previews and projects
      - Wraps calls with auth token required by backend in prod
  - **shared/**
    - Contains components and models used in multiple parts of the application, or components deemed reusable for future development
    - **chatbot/**
      - Component responsible for rendering the chatbot
      - Interacts with chatbot via the ChatbotHttpService
    - **editable-value/**
      - Simple presentational component
      - Inputs a value and a display type (currency or percentage)
      - Renders a value that users can click and modify
      - Emits modified value
    - **models/**
      - api.models
        - Contains interfaces that directly interact with the APIs
      - project.models
        - Interfaces closely related to those api.models, but in more flexible formats for easier rendering
    - **projects-table/**
      - Presentational component rendering project previews table
      - Separated from dashboard in case of future desire for flexibility
      - Inputs array of project previews
      - Emits on projectClick and createProjectClick
      - Uses Angular Material
    - **sidebar/**
      - Component renders sidebar that persists throughout the application
      - Links to dashboard, chatbot, and logout
      - Presents chatbot window
      - Uses FontAwesome for logos
- **environments/** 
  - Not in Git repository, will need to be added (instructions in setup section)
  - Contains route information for development and production environments
### Project Setup
- Cloning the project
  - Clone capstone-frontend from f24-capgemini-const repository
  - Open the project in the IDE of choice
- Setting up the environment
  - Create an environments/ folder within capstone-frontend/src/
  - Within the environments/ folder, create files “environment.development.ts” and “environment.ts”
  - In environment.development.ts
    - Create an environment object with properties production and apiUrl
    - Set production to false, apiUrl to the backend’s route, and chatbotUrl to the chatbot's route
  - In environment.ts
    - Paste a copy of the environment object created in the development file
    - Switch the production value to true
    - Replace apiUrl with the hosted backend url and chatbotUrl with the hosted chatbot url
  - Open a terminal to the capstone-frontend/ directory
    - Run “npm i” to install required dependencies in node_modules/
- Running the project
  - Open a terminal to the capstone-frontend/ directory
    - Run “ng serve” to launch the project in development mode and open http://localhost:4200/
      - NOTE: The backend must also be running in development mode for any page of the application to render. This is because the routes are not set to complete until the necessary data is fetched from the backend to prevent UX issues like flickering
      - NOTE: Your IP must be whitelisted by the capstoneProjects database for any API request to the backend to succeed
    - Run “ng build” to build the project for production
