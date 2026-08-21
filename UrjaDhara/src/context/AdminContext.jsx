import { createContext, useContext, useState } from 'react';

const AdminContext = createContext();

const DEMO_INQUIRIES = [
  { id: 1, name: 'Ramesh Sahu', email: 'ramesh@gov.cg.in', mobile: '9876543210', organisation: 'District Collector Office', facilityType: 'School', state: 'Chhattisgarh', district: 'Bastar', enquiryType: 'Solar Energy Installation', urgency: 'high', message: 'We have 12 schools in Bastar without electricity. Need solar panels urgently.', newsletter: true, date: new Date('2024-03-10T09:30:00'), status: 'pending' },
  { id: 2, name: 'Priya Verma', email: 'priya.ngo@gmail.com', mobile: '9812345678', organisation: 'Green Earth NGO', facilityType: 'Village / Community', state: 'Odisha', district: 'Koraput', enquiryType: 'Water Pump System', urgency: 'high', message: 'Village of 800 people has no clean water. Need solar water pump system.', newsletter: false, date: new Date('2024-03-11T11:00:00'), status: 'in-progress' },
  { id: 3, name: 'Suresh Kumar', email: 'suresh.k@mphealthdept.in', mobile: '9765432109', organisation: 'MP Health Department', facilityType: 'Health Centre', state: 'Madhya Pradesh', district: 'Shivpuri', enquiryType: 'Hybrid Renewable Setup', urgency: 'normal', message: 'PHC needs 24/7 power for vaccine storage. Interested in hybrid solar setup.', newsletter: true, date: new Date('2024-03-12T14:15:00'), status: 'resolved' },
  { id: 4, name: 'Anita Patel', email: 'anita.p@gujarat.gov.in', mobile: '9654321098', organisation: 'Gujarat Rural Dev', facilityType: 'Government Office', state: 'Gujarat', district: 'Dahod', enquiryType: 'Cost & Feasibility Study', urgency: 'low', message: 'Need cost estimate for 50 solar pumps across tribal blocks.', newsletter: true, date: new Date('2024-03-13T10:00:00'), status: 'pending' },
  { id: 5, name: 'Mohammed Iqbal', email: 'iqbal.r@rajasthan.nic.in', mobile: '9543210987', organisation: 'Rajasthan Jal Board', facilityType: 'Village / Community', state: 'Rajasthan', district: 'Barmer', enquiryType: 'Water Pump System', urgency: 'high', message: 'Desert region. 30 villages need solar water pumps. Groundwater at 80m depth.', newsletter: false, date: new Date('2024-03-14T08:45:00'), status: 'in-progress' },
  { id: 6, name: 'Kavita Singh', email: 'kavita.s@jharkhand.edu.in', mobile: '9432109876', organisation: 'Jharkhand Education Dept', facilityType: 'School', state: 'Jharkhand', district: 'Lohardaga', enquiryType: 'Solar Energy Installation', urgency: 'normal', message: 'Block has 8 schools with no grid connection. Want solar panels with battery backup.', newsletter: true, date: new Date('2024-03-14T16:20:00'), status: 'pending' },
  { id: 7, name: 'Deepak Rao', email: 'deepak.rao@ap.gov.in', mobile: '9321098765', organisation: 'AP Tribal Welfare', facilityType: 'Health Centre', state: 'Andhra Pradesh', district: 'Visakhapatnam', enquiryType: 'Government Scheme Guidance', urgency: 'low', message: 'Want to know about PM-KUSUM scheme eligibility for tribal health centres.', newsletter: false, date: new Date('2024-03-15T09:10:00'), status: 'resolved' },
  { id: 8, name: 'Sunita Devi', email: 'sunita.d@bihar.gov.in', mobile: '9210987654', organisation: 'Bihar Rural Works Dept', facilityType: 'Village / Community', state: 'Bihar', district: 'Gaya', enquiryType: 'Planning Dashboard Demo', urgency: 'normal', message: 'Want a demo of the planning dashboard for our district team of 20 officials.', newsletter: true, date: new Date('2024-03-15T13:30:00'), status: 'pending' },
];

const DEMO_USERS = [
  { name: 'Ramesh Sahu', email: 'ramesh@gov.cg.in', mobile: '9876543210', role: 'Government Official', state: 'Chhattisgarh', joinDate: new Date('2024-03-10'), avatar: null },
  { name: 'Priya Verma', email: 'priya.ngo@gmail.com', mobile: '9812345678', role: 'NGO Worker', state: 'Odisha', joinDate: new Date('2024-03-11'), avatar: null },
  { name: 'Suresh Kumar', email: 'suresh.k@mphealthdept.in', mobile: '9765432109', role: 'Planner / Engineer', state: 'Madhya Pradesh', joinDate: new Date('2024-03-12'), avatar: null },
  { name: 'Anita Patel', email: 'anita.p@gujarat.gov.in', mobile: '9654321098', role: 'Government Official', state: 'Gujarat', joinDate: new Date('2024-03-13'), avatar: null },
  { name: 'Mohammed Iqbal', email: 'iqbal.r@rajasthan.nic.in', mobile: '9543210987', role: 'Planner / Engineer', state: 'Rajasthan', joinDate: new Date('2024-03-14'), avatar: null },
];

export const AdminProvider = ({ children }) => {
  const [inquiries, setInquiries] = useState(DEMO_INQUIRIES);
  const [registeredUsers, setRegisteredUsers] = useState(DEMO_USERS);

  const addInquiry = (data) => {
    const newInq = { ...data, id: Date.now(), date: new Date(), status: 'pending' };
    setInquiries(prev => [newInq, ...prev]);
  };

  const updateStatus = (id, status) => {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  const deleteInquiry = (id) => {
    setInquiries(prev => prev.filter(i => i.id !== id));
  };

  const addUser = (user) => {
    setRegisteredUsers(prev => [...prev, { ...user, joinDate: new Date() }]);
  };

  return (
    <AdminContext.Provider value={{ inquiries, registeredUsers, addInquiry, updateStatus, deleteInquiry, addUser }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
