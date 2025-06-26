# 🏢 Tenant Access Guide

## How Tenants Access Their Dashboard

### 📋 **Overview**
When a super admin creates a tenant, the system automatically:
1. Creates a tenant record with a unique subdomain
2. Creates a tenant admin user with login credentials
3. Sets up tenant-specific branding and settings

### 🔐 **Tenant Admin Credentials**
When a tenant is created, the system automatically generates:
- **Email**: The email provided during tenant creation
- **Password**: `TempPassword123!` (temporary password)
- **Role**: `tenantAdmin`

### 🌐 **Access Methods**

#### **Method 1: Direct Subdomain Access**
```
https://[subdomain].localhost:3000
```
Example: `https://greenscape.localhost:3000`

#### **Method 2: Main Domain with Tenant Selection**
```
https://localhost:3000/login
```
Then select the tenant from a dropdown or enter subdomain.

### 🚀 **Step-by-Step Access Process**

#### **For New Tenants:**

1. **Get Credentials from Super Admin**
   - Email: `contact@greenscape.com` (as provided during creation)
   - Password: `TempPassword123!`

2. **Access via Subdomain**
   - Go to: `greenscape.localhost:3000`
   - You'll see tenant-specific branding and login page

3. **Login**
   - Enter the email and temporary password
   - System will redirect to `/admin` dashboard

4. **First-Time Setup**
   - Change the temporary password
   - Complete business profile setup
   - Configure branding and settings

#### **For Existing Tenants:**

1. **Direct Access**
   - Go to your subdomain: `greenscape.localhost:3000`
   - Login with your credentials

2. **Dashboard Access**
   - After login, you'll be redirected to `/admin`
   - Access all tenant-specific features

### 🏗️ **Multi-Tenant Architecture**

#### **Subdomain Resolution:**
```
greenscape.localhost:3000 → Tenant: GreenScape Landscaping
bloomgrow.localhost:3000  → Tenant: Bloom & Grow Gardens
evergreen.localhost:3000  → Tenant: Evergreen Solutions
```

#### **Tenant Context:**
- Each subdomain automatically resolves to the correct tenant
- All API calls include tenant context via `X-Tenant-Subdomain` header
- Data is automatically filtered by tenant ID

#### **Role-Based Access:**
- **tenantAdmin**: Full access to tenant dashboard (`/admin`)
- **staff**: Limited access to assigned features
- **customer**: Public booking and customer portal

### 📱 **Tenant Dashboard Features**

#### **Available at `/admin`:**
- 📊 **Dashboard**: Overview and analytics
- 👥 **Customers**: Manage customer database
- 📅 **Appointments**: Schedule and manage bookings
- 🛠️ **Services**: Manage service offerings
- 💰 **Estimates**: Create and manage estimates
- 👨‍💼 **Staff**: Manage team members
- 🖼️ **Gallery**: Manage portfolio images
- ⚙️ **Settings**: Configure business settings
- 📢 **Announcements**: Manage business announcements

### 🔧 **Technical Implementation**

#### **Frontend (Next.js):**
```javascript
// Tenant context automatically resolves subdomain
const subdomain = extractSubdomain(); // e.g., "greenscape"
const tenant = await fetchTenantInfo(subdomain);
```

#### **Backend (Node.js):**
```javascript
// Tenant middleware automatically filters data
app.use(resolveTenant); // Sets req.tenant
app.use('/api/v1/*', (req, res, next) => {
  // All data filtered by tenant ID
});
```

#### **Database:**
```javascript
// All models include tenant scope
const Appointment = mongoose.model('Appointment', {
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  // ... other fields
});
```

### 🛡️ **Security & Isolation**

#### **Data Isolation:**
- Each tenant's data is completely isolated
- No cross-tenant data access
- Automatic tenant filtering on all queries

#### **Authentication:**
- JWT tokens include tenant context
- Role-based access control per tenant
- Session management per tenant

#### **API Security:**
- All API calls include tenant subdomain header
- Backend validates tenant access on every request
- Super admin can access all tenants

### 🔄 **Development Setup**

#### **Local Development:**
1. **Backend**: `http://localhost:5000`
2. **Frontend**: `http://localhost:3000`
3. **Tenant Access**: `http://[subdomain].localhost:3000`

#### **Environment Variables:**
```env
# Frontend (.env.local)
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_MAIN_DOMAIN=http://localhost:3000

# Backend (.env)
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_uri
```

### 📞 **Support & Troubleshooting**

#### **Common Issues:**
1. **Subdomain not resolving**: Check DNS/hosts file
2. **Login fails**: Verify credentials and tenant status
3. **Data not loading**: Check tenant context and API headers

#### **Getting Help:**
- Contact super admin for account issues
- Check tenant status in super admin dashboard
- Verify subdomain configuration

### 🎯 **Next Steps for Tenants**

1. **Complete Profile Setup**
2. **Configure Business Settings**
3. **Add Services and Pricing**
4. **Invite Staff Members**
5. **Start Managing Customers and Appointments**

---

**Note**: This guide assumes the multi-tenant system is properly configured with subdomain routing and tenant resolution middleware. 