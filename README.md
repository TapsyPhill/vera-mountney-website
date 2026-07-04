# Vera Mountney Website

Static website for [vera-mountney.de](https://vera-mountney.de). This repository contains a simple test homepage and automated deployment to Namecheap/cPanel hosting via GitHub Actions.

## Project Structure

```
public/           # Static site files (deployed to the server)
.github/          # GitHub Actions workflows
```

## Deployment

Deployment runs automatically through GitHub Actions whenever changes are pushed to the `main` branch. You can also trigger a deployment manually from the **Actions** tab using **Run workflow**.

The workflow deploys only the contents of the `public/` folder to the FTP server using FTPS.

### Required GitHub Secrets

Add these secrets in your repository under **Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `FTP_SERVER` | FTP server hostname |
| `FTP_USERNAME` | FTP account username |
| `FTP_PASSWORD` | FTP account password |
| `FTP_PORT` | FTP port (e.g. `21`) |
| `FTP_PROTOCOL` | Connection protocol (e.g. `ftps`) |
| `FTP_TARGET_DIR` | Target directory on the server (e.g. `./`) |

Do not commit credentials to this repository.
