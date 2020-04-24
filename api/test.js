const request = require('request-promise');

let optionsRequest = {
  method: 'POST',
  uri: 'http://localhost:3000/predictsaas',
  body: {
    url: 'https://bit.dev/',
    text: `"ClickUp
    Product
    Pricing
    Learn
    Templates
    Sign in
    Sign up
    One app to
    replace them all.
    All your work in one place: Tasks, docs, chat, goals, & more.
    Get Started
         Based on 5,000+ reviews on
    JOIN 100,000+ HIGHLY PRODUCTIVE TEAMS
    Free Forever
    FEATURES
    This is the future of work.
    TO-DO LISTS
    PROJECT MANAGEMENT
    DOCS & NOTES
    SPREADSHEETS
    EMAIL & CHAT
    EVENTS
    REMINDERS
    GOAL TRACKING
    TIME TRACKING
    SCREENSHOTS & RECORDING
    Get Started
    Previous
    Tasks
    From simple to complex, you can create tasks for anything in ClickUp.
    REPLACES:
    Projects
    Build your perfect project using world class feature customization only possible in ClickUp.
    REPLACES:
    Docs
    Create beautiful docs, wikis, and knowledge bases anywhere in ClickUp. Use /slash commands and share docs with anyone.
    REPLACES:
    Spreadsheets
    Bring Google Sheets and Airtable Bases directly into ClickUp - edit and collaborate without leaving ClickUp.
    WORKS WITH:
    Conversations
    Everything gets lost in endless threads and channels - keep the communication about your work, with your work.
    REPLACES:
    WORKS WITH:
    Calendar, Timeline, Gantt
    Use ClickUp calendars, timelines, and Gantt charts to plan tasks, schedule your team, and sync in real-time with Google, Outlook, and Apple.
    REPLACES:
    WORKS WITH:
    2-Way Sync
    Inbox & Reminders
    Reminders are simple to create, repeat, delegate or convert to tasks with the ClickUp Inbox.
    REPLACES:
    Goals & OKR’s
    Set goals, align your team, and track your progress in real-time.
    REPLACES:
    Estimate & Track Time
    Track time, add estimates, and build reports directly in ClickUp, or sync with your preferred tool.
    NATIVE TIME TRACKING:
    WORKS WITH:
    Clip
    Capture images and record videos of your desktop right in your browser.
    REPLACES:
    Next
    1
    2
    3
    4
    5
    6
    7
    8
    9
    10
    VIEWS
    Create your own views.
    Previous
    List View
    Board View
    Box View
    Calendar View
    Gantt View
    File view
    Form view
    Next
    1
    2
    3
    4
    5
    6
    7
    IMPORT
    Switching to ClickUp?
    
    Automatically import your stuff from other "productivity" apps. We'll set everything up for you in minutes.
    
    Import Now
    CUSTOMIZE
    Spaces
    Features
    Statuses
    Colors
    Previous
    Simple space
    Medium space
    Advanced space
    STATUSES
    TO DO
    COMPLETE
    FEATURES
    Priority
    Custom fields
    Multiple assignees
    Time tracking
    Time estimates
    Tags
    Plus 10 more ClickApps to choose from
    DESCRIPTION:
    ClickUp's 'Spaces' are completely customizable, so every type of team can work together while using their own Space. Use a simple Space for something like customer service and a complex Space for engineering.
    Assign Comments
    Resolve Comments
    Recurring Tasks
    Google Calendar 2-Way Sync
    Task Checklists
    Filter and Search
    Sorting
    Customize Assignees
    Collaboration Detection
    Image Mockups
    Multiple Assignees
    Threaded Comments
    Multitask Toolbar
    Super Rich Editing
    Chrome Extension
    Priorities
    Agile Board View
    Box View
    Progress Percentage
    Hierarchy
    Custom Notifications
    Activity Stream
    Mentions
    DESCRIPTION:
    With over 100 proprietary features you'll only find in ClickUp, you get to choose what you want and hide everything else.
    Custom
    Add different stages to your tasks such as 'in progress' so you know what everyone is working on.
    Simple
    Use simple checklists to show when tasks are 'done' or 'not done'.
    DESCRIPTION:
    Choose simple checklists or more advanced workflows called 'statuses' so you can know exactly what's going on without asking for updates.
    DESCRIPTION:
    Colors in ClickUp make life easier. Themes make ClickUp your happy place, but colors are also functional. Green statuses in ClickUp typically mean they're on track or completed, and alarming colors like red, orange, and yellow represent action required steps. This trend is useful across other areas too. Custom fields, Spaces, Lists, and more let you add more flexibility to how you manage your work.
    Next
    PROBLEMS
    Solved by ClickUp
    Previous
    02
    You’ll know what everyone is working on.
    03
    Everyone knows what to do next.
    04
    All teams can work together, finally.
    05
    You’ll get a birds-eye view of literally everything.
    01
    You’ll no longer have to use separate apps.
    SOLUTION
    Add Kanban Boards, Gantt charts, Calendars, and more alongside docs, conversations, reminders, spreadsheets, and embeds to keep all of your work in one place.
    02
    You’ll know what everyone is working on.
    03
    Everyone knows what to do next.
    04
    All teams can work together, finally.
    05
    You’ll get a birds-eye view of literally everything.
    01
    You’ll no longer have to use separate apps.
    02
    You’ll know what everyone is working on.
    03
    Everyone knows what to do next.
    04
    All teams can work together, finally.
    Next
    PROPRIETARY FEATURES
    01. Slash Commands
    02. Real-time Chat
    03. Task Tray
    04. Assign Comments
    05 . Inbox
    More Features
    Do everything without ever clicking your mouse. Just type / when creating or editing tasks.
    TEMPLATES
    Easy to manage
    Previous
    Use template
    See more templates
    Use template
    See more templates
    Use template
    See more templates
    Use template
    See more templates
    Use template
    See more templates
    Use template
    See more templates
    Use template
    See more templates
    Use template
    See more templates
    Use template
    See more templates
    Use template
    See more templates
    Use template
    See more templates
    Use template
    See more templates
    Use template
    See more templates
    Next
    1
    2
    3
    4
    5
    6
    7
    8
    9
    INTEGRATIONS
    1,000+ integrations.
    Time Tracking
    Cloud Storage
    Developers
    Calendar
    More
    Previous
    Next
    APPS
    All the
    apps.
    
    You can download ClickUp for any platform, on everything and everywhere.
    
    Download ClickUp
    Got questions?
    We've got 24/7 world-class support ready to help. Our #1 core value is customer service.
    Watch a Demo
    Get in Touch
    Start Chat
    On-demand demo & 24-hour support
    99.99% uptime the last 12 months
    Serious about security & privacy
    CLICKUP
    About us
    Apps
    Careers
    Contact us
    Demo
    Free Webinar
    Roadmap
    More ClickUp
    Enterprise
    Affiliates & Refferals
    Consultants
    Customers
    Help Docs
    Import
    Reviews
    Brand
    Case studies
    Status
    FEATURES
    Forms
    Notepad
    Gantt Chart
    Templates
    Time Tracking
    Custom Task Statuses
    Recurring Tasks
    More features
    Time Management
    Reporting
    Email + Tasks
    Processes
    Favorites
    Custom Fields
    Checklists
    Super Rich Editing
    Dependencies
    Multitask Toolbar
    Two-Factor Authentication
    Kanban Board
    Single Sign-On
    Time Estimates
    Custom Project Management
    To Do Lists
    Screenshots
    Task Templates
    Reminders
    Collaboration
    Custom organization
    Priorities
    Tags
    Task Tray
    Multiple assignees
    Hotkeys & Shortcuts
    Task & Page Views
    Dates & Times
    All features
    INTEGRATIONS
    API Docs
    Chrome Extension
    Slack
    Outlook and Office 365
    Google Calendar
    Google Drive
    GitHub
    More integrations
    Gitlab
    Time Doctor
    Everhour
    Toggl
    Alexa
    Dropbox
    Bitbucket
    Microsoft & Google SSO
    Harvest
    Clockify
    Google Assistant
    OneDrive
    MS Teams
    Zendesk
    Sentry
    Intercom
    Hangouts Chat
    Zapier
    Webhooks
    Front
    Helpscout
    Google Sheets
    Google Forms
    RingCentral
    Calendly
    Hubspot
    Evernote
    Gmail
    Typeform
    Intercom
    Salesforce
    SharpSpring
    COMPARE
    Trello Alternative
    Asana Comparison
    Monday.com Alternative
    Asana Alternative
    Airtable Alternative
    Monday Alternative
    Basecamp Alternative
    More comparisons
    Todoist Alternative
    Jira Alternative
    Notion Alternative
    Flow Alternative
    Clarizen Alternative
    Atlaz Alternative
    Smartsheet Alternative
    Pivotal Tracker Alternative
    Plutio Alternative
    Podio Alternative
    Sprintly Alternative
    Producteev Alternative
    Wunderlist Alternative
    BLOG
    Scrum vs Kanban: Which one is right for you?
    25+ Remote Work Tools to Make Work From Home a Breeze
    Understanding Sprint Retrospectives (Ultimate Guide)
    Airtable Review 2020 (Features, Pros, Cons, Pricing)
    The Ultimate Guide To Scrum Project Management (2020)
    What Are Scrum Artifacts? (Ultimate Guide)
    The Ultimate Guide To Scrumban (2020)
    Read all our blogs
    ClickUp
    SF | SAN DIEGO
    © 2020 ClickUp Security Your Privacy Terms
    ClickUp was created using ClickUp
    Home
    Pricing
    Product 
    Learn 
    Templates 
    Sign in
    Sign up`
  },
  json: true // Automatically stringifies the body to JSON
};

setTimeout(()=>{
  request(optionsRequest)
  .then(function (parsedBody) {
    console.log('Got a response from api..', parsedBody)
  })
  .catch(console.error);
},2000)