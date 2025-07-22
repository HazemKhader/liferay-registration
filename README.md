# Liferay Registration Workflow

Registration and approval workflow built on Liferay DXP. Guests can submit ID/Passport scans, admins review pending requests, and approved users are auto-created in Liferay.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Run Liferay Server](#run-liferay-server)
- [Deployment](#deployment)
- [Liferay Object Setup](#liferay-object-setup)
- [CORS Configuration](#cors-configuration)
- [Workflow Configuration](#workflow-configuration)
- [Custom User Fields](#custom-user-fields)
- [Fragments & Pages](#fragments--pages)
  - [Admin View Fragment](#admin-view-fragment)
  - [Admin Pending Requests Page](#admin-pending-requests-page)
  - [Public Registration Page](#public-registration-page)
- [Testing](#testing)
  - [Registration Scenario](#registration-scenario)
    - [Guest Scenario](#guest-scenario)
    - [Admin Scenario](#admin-scenario)

---

## Prerequisites

- **Java 11+**
- **Liferay DXP 7.4 GA132** (or compatible)
- **Blade CLI** v7.0.3+
- **Git**

---

# Installation

```bash
# 1. Clone the repo
git clone https://github.com/HazemKhader/liferay-registration.git

# 2. Enter the workspace
cd registration-workspace
```

# Liferay Server

### 1. Start Embedded Server (`Jump to`[Testing](#testing) `Step`)

```bash
    blade server start
```

- **Login as Administrator:** `test@liferay.com:learn`

### 2. Start your Liferay instance(`Continue step-by-step`)

## Deployment

Build and deploy the Public Registration Element client-extension:

```
# From the workspace root
blade gw build
blade gw deploy
```

## Liferay Object Setup

1. Login as an administrator.
2. Navigate to Global Menu → System Settings → Script Management.
3. Tick Allow administrator to create and execute code in Liferay → Save.
4. Navigate to Global Menu → Control Panel → Objects.
5. Click Import → Name it **RegistrationRequest**, select from root workspace:

   `registration-object-definition/Object_Definition_RegistrationRequest.json`

6. After creation, click ••• → Configuration → Permissions, and enable View for Guest.
7. Go to Control Panel → Roles → Guest → Define Permissions → Objects.
8. Select RegistrationRequest → Enable Add Object Entry → Save.

## CORS Configuration

### Allow guest pages to call the headless API:

1. Go to Control Panel → System Settings → Security Tools → Portal Cross‑Origin Resource Sharing (CORS).
2. Click Edit, then add new URL Pattern:

   `/o/c/registrationrequest/*`

3. Save your changes.

## Workflow Configuration

### Apply a single‑approver workflow to the RegistrationRequest object:

1. Navigate to Global Menu → Applications → Process Builder.
2. In the Configuration tab, search for RegistrationRequest.
3. Click Edit, select Single Approver, and Save.

## Custom User Fields

#### Use Expando custom fields on the User entity:

1.  Navigate to Global Menu → Control Panel → Custom Fields → User.
2.  Create two new fields:

    - Field Name: documentype \
      Type: Text

    - Field Name: documentId \
      Type: Text

## Fragments & Pages

### Admin View Fragment

1.  Go to Product Menu → Design → Fragments.
2.  Click ••• → Import → Select File, select from root workspace:

    `Fragments/Registration_Fragment_Collections.zip`

3.  Click Import → Done.

### Admin Pending Requests Page

1.  Go to Product Menu → Site Builder → Pages → New → Blank Page.
2.  Name it **Admin Pending Requests**.
3.  From right sidebar **Fragments & Widgets** drag and drop **Admin View Fragment**.
4.  Publish the page.
5.  Click ••• of **Admin Pending Requests** page → Permissions, remove Guest and Site Member.

### Public Registration Page

1.  Go to Product Menu → Site Builder → Pages → New → Blank Page.
2.  Name it **Registration**.
3.  From right sidebar **Fragments & Widgets** drag and drop **Public Registration Element**.
4.  Publish the page.
5.  Click ••• of **Registration** page → Permissions, remove **site member** permissions.

# Testing

## Registration Scenario

### Guest Scenario

1.  Guest navigates to the **Registration page**.
2.  Fills out standard fields (**first name**, **email**, **etc.**).
3.  Selects document type and uploads an ID/Passport scan.

    - You can find some dummy Passports/IDs:

      `registration-workspace\client-extensions\public-registration-element\statics`

4.  The system extracts the Document ID and attaches it to the request.
5.  Submit the form and see a success message.

### Admin Scenario

1.  Login as Administrator.

    `test@liferay.com:learn`

2.  Navigate to **Admin Pending Requests** page to view all pending cards where you can approve (`A new Liferay user is auto-created with the submitted data.`) or reject (`The request is marked as rejected.`) the request.

    #### Note:

    - Observe notification for new registration requests.
