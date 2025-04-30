# CANARYY - Outlook Add-in  

Welcome to **Canaryy**, an Outlook add-in designed to enhance your email experience. Follow the steps below to set up, explore, and deploy the project.  

---

## 🚀 Getting Started  

### Prerequisites  

Ensure you have the following installed before proceeding:  

- **Node.js (Latest LTS version)** – Download from [Node.js official site](https://nodejs.org/)  
- **Git** – Install from [Git official site](https://git-scm.com/)  
- **VS Code** (or any preferred IDE)  

To verify the installation of Node.js and npm, run the following commands:  

```bash
node -v
npm -v
```

### ⚡ Installation & Setup  

1. **Clone the repository** and open it in VS Code:  

   ```bash
   git clone https://usernaname/AccessPlane
   cd canaryy
   ```

2. **Install dependencies**:  

   ```bash
   npm install
   ```

3. **Start the project**:  

   ```bash
   npm start
   ```

---

## 📂 Project Structure  

Below are the key files and their purposes:

- **`manifest.xml`** – Defines the add-in’s settings and capabilities.  
  - Validate the manifest using the **Validate Manifest File** option in the Office Add-ins Development Kit.
- **`src/taskpane/taskpane.html`** – Contains the HTML structure for the task pane.  
- **`src/taskpane/**/*.tsx`** – Includes the React components and Office JavaScript API integrations.  

---

## 🛠 Debugging on Mac  

To debug the add-in on Mac or iPad, refer to the official Microsoft guide:  

🔗 [Debug Office Add-ins on iPad](https://learn.microsoft.com/en-us/office/dev/add-ins/testing/debug-office-add-ins-on-ipad-and-mac)  

---

## 🚀 Deploying the Add-in  

Follow these steps to deploy your add-in:

1. **Build the project**:  

   ```bash
   npm run build
   ```

   After a successful build, the `dist` folder will contain the deployment files.

2. **Host the files**:  
   Upload the contents of the `dist` folder to any hosting service (e.g., **GitHub Pages, Azure, AWS, Netlify**).

3. **Update the manifest file**:  
   Replace all occurrences of `https://localhost:3000/` with your live deployment URL.

### Example Update:  

Replace:  

```xml
https://localhost:3000/
```

With:  

```xml
https://your-live-url.com/
```

---

## 📝 Additional Resources  

- 📖 [Microsoft Office Add-ins Documentation](https://learn.microsoft.com/en-us/office/dev/add-ins/)  
- 🚀 [Publishing Office Add-ins](https://learn.microsoft.com/en-us/office/dev/add-ins/publish/publish-add-in-vs-code#using-visual-studio-code-to-publish)  

---
