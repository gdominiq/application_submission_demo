# Application Submission Portal

A comprehensive web application for managing application submissions, designed with Power Apps/D365 environment compatibility in mind. Built using standard web technologies including HTML5, CSS3, JavaScript, Bootstrap 5, and jQuery.

## 🎯 Overview

This application provides a complete solution for managing applications (job applications, grant applications, scholarship applications, vendor registrations, etc.) with features for both applicants and administrators.

## ✨ Features

### Epic 1: Application Management
- **Feature: Application Submission Form** - Intuitive form interface for submitting applications with validation
- **Feature: Application Listing/Tracking** - View and track all submitted applications with filtering and search capabilities
- **Feature: Application Status Management** - Real-time status updates (Pending, Under Review, Approved, Rejected)

### Epic 2: User Management
- **Feature: User Profile Management** - Manage personal information and view application statistics
- **Feature: User Authentication** - Mock authentication system demonstrating secure access patterns

### Epic 3: Admin Dashboard
- **Feature: View All Applications** - Comprehensive admin view of all applications with advanced filtering
- **Feature: Update Application Status** - Ability to change status and add administrative notes
- **Feature: Generate Reports** - Export application data to CSV format

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server-side dependencies required - runs entirely in the browser

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gdominiq/application_submission_demo.git
   cd application_submission_demo
   ```

2. Open `index.html` in your web browser:
   ```bash
   # On macOS
   open index.html
   
   # On Linux
   xdg-open index.html
   
   # On Windows
   start index.html
   ```

3. Or use a local web server (recommended):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js http-server
   npx http-server
   ```

4. Navigate to `http://localhost:8000` in your browser

## 📁 Project Structure

```
application_submission_demo/
├── index.html              # Home page with overview and statistics
├── submit.html            # Application submission form
├── applications.html      # User's application list view
├── admin.html            # Admin dashboard for managing applications
├── profile.html          # User profile management page
├── css/
│   └── styles.css        # Custom styling for the application
├── js/
│   └── app.js            # Core JavaScript functionality
├── README.md             # This file
└── LICENSE               # GPL-3.0 License
```

## 🛠️ Technology Stack

- **HTML5** - Semantic markup structure
- **CSS3** - Custom styling with modern CSS features
- **Bootstrap 5.1.3** - Responsive UI framework
- **Bootstrap Icons** - Icon library
- **JavaScript (ES6+)** - Core application logic
- **jQuery 3.6.0** - DOM manipulation and utilities
- **LocalStorage API** - Client-side data persistence

## 📖 User Guide

### For Applicants

1. **Submit an Application**:
   - Click "Submit Application" in the navigation or home page
   - Fill out all required fields (marked with *)
   - Agree to terms and conditions
   - Submit the form
   - Note your Application ID for tracking

2. **View Your Applications**:
   - Navigate to "My Applications"
   - Use filters to search by status or type
   - Click "View" to see full application details
   - Delete applications if needed

3. **Manage Your Profile**:
   - Go to "Profile" page
   - Edit personal information
   - View application statistics
   - Change password (mock feature)

### For Administrators

1. **Access Admin Dashboard**:
   - Navigate to "Admin" in the navigation menu
   - View statistics at a glance

2. **Manage Applications**:
   - Filter applications by status, type, or search term
   - Click "View" to see full details
   - Click "Update" to change application status and add notes

3. **Generate Reports**:
   - Click "Export Report" to download a CSV file
   - Contains all application data for analysis

## 🔧 Configuration

### Customization

The application can be easily customized by modifying:

- **Colors and Themes**: Edit `css/styles.css` and CSS variables in `:root`
- **Application Types**: Modify the dropdown options in `submit.html`
- **Status Values**: Update status options in `admin.html` and corresponding JavaScript functions
- **Form Fields**: Add or remove fields in `submit.html` and update the JavaScript save functions

### Data Persistence

The application uses browser LocalStorage for data persistence:
- Data is stored locally in the browser
- No backend server required
- Data persists across sessions
- Clear browser data to reset the application

### Integration with Power Apps/D365

This application is designed to be compatible with Power Apps/D365 environments:

1. **Standards Compliance**: Uses standard web technologies that can be embedded in Power Apps portals
2. **Bootstrap Framework**: Compatible with Power Apps portal theming
3. **RESTful Design**: Data functions can be easily adapted to call Dynamics 365 Web API
4. **Form Patterns**: Follows common form patterns used in Power Apps
5. **Responsive Design**: Works across devices like Power Apps components

## 🔒 Security Considerations

- Client-side storage is used for demonstration purposes
- In production, implement server-side authentication
- Add HTTPS for secure data transmission
- Implement proper authorization checks
- Sanitize user inputs to prevent XSS attacks
- Add CSRF protection for state-changing operations

## 🧪 Testing

The application has been tested with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Manual Testing Checklist

- [ ] Submit a new application
- [ ] View application list with different filters
- [ ] Update application status as admin
- [ ] Export report to CSV
- [ ] Edit user profile
- [ ] Test responsive design on mobile devices

## 📝 Data Model

### Application Object
```javascript
{
  id: Number,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  applicationType: String,
  position: String,
  description: String,
  experience: Number,
  expectedSalary: Number,
  skills: String,
  referenceSource: String,
  status: String, // 'pending' | 'under_review' | 'approved' | 'rejected'
  submittedDate: ISO String,
  lastUpdated: ISO String,
  notes: String
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 👥 Author

Created for demonstration purposes.

## 🙏 Acknowledgments

- Bootstrap team for the excellent UI framework
- Bootstrap Icons for the comprehensive icon set
- jQuery team for the utility library

## 📞 Support

For issues, questions, or contributions, please open an issue in the GitHub repository.

---

**Note**: This is a demonstration application. For production use, implement proper backend services, authentication, authorization, and security measures appropriate for your environment.