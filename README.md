# Setup

## 1) Before all else

Ensure these ports are not occupied:

- 3000 (frontend)
- 4000 (if use offline backend)
- 9000 (if use offline backend)

Then run these commands in the terminal

```
# in main directory
npm install

```

## 2) Backend

Choose one: Offline or Online. You cannot select both!

### Offline

```
firebase emulators:start
```

Do these steps before starting frontend:

1. Ensure its running on port 4000
1. Go to localhost:4000/database/is4261/data
1. Click ... for more options, then click import JSON
1. Browse for JSON file at ./Firebase/is4261-default-rtdb-export.json
1. Click import
1. End offline database

### Online

```
# do the following and nothing more
```

1. Check and verify firebaseConfig details in ./Firebase/firebaseConfig
1. Ensure access to google services (google.com)
1. End online database

## 3) Frontend

1. Ensure its running in port 3000
1. Then go to localhost:3000

```
# in main directory
npm start
```

## 4) Done

You are done with setup!

### Troubleshooting for developers

```
# Offline Firebase setup
npm i -g firebase-tools
firebase --version
firebase login
firebase init
```
