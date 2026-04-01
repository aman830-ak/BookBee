import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute"; // <-- NEW IMPORT

// User Pages
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import TicketBooking from "./pages/TicketBooking";
import MyTickets from "./pages/MyTickets";
import Favorite from "./pages/Favorite";
import Theaters from "./pages/Theaters";
import Releases from "./pages/Releases";
import ContactUs from "./pages/ContactUs";
import HelpCenter from "./pages/HelpCenter"; 
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Profile from "./pages/Profile";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import AddShows from "./pages/admin/AddShows";
import Layout from "./pages/admin/Layout";
import ListShows from "./pages/admin/ListShows";
import ListBookings from "./pages/admin/ListBookings";
import ManageReleases from "./pages/admin/ManageReleases";
import Inbox from "./pages/admin/Inbox";
import NewsletterList from "./pages/admin/NewsletterList";
import VerifyTicket from "./pages/admin/VerifyTicket";
import PromoManager from "./pages/admin/PromoManager";

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b]">
      <Toaster position="top-center" /> 
      
      {!isAdminRoute && <Navbar />}
      
      <main className="flex-grow">
        <Routes>
          {/* Main User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/movies/:id/today" element={<TicketBooking />} />
          
          {/* Support & Legal Pages */}
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="/favorite" element={<Favorite />} />
          <Route path="/theaters" element={<Theaters />} />
          <Route path="/releases" element={<Releases />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/profile" element={<Profile />} />

          {/* 🔥 SECURED Admin Section 🔥 */}
          <Route path="/admin">
            <Route index element={<AdminRoute><Dashboard /></AdminRoute>} /> 
            <Route path="add-shows" element={<AdminRoute><AddShows /></AdminRoute>} /> 
            <Route path="layout" element={<AdminRoute><Layout /></AdminRoute>} /> 
            <Route path="list-shows" element={<AdminRoute><ListShows /></AdminRoute>} /> 
            <Route path="list-bookings" element={<AdminRoute><ListBookings /></AdminRoute>} /> 
            <Route path="manage-releases" element={<AdminRoute><ManageReleases /></AdminRoute>} />
            <Route path="inbox" element={<AdminRoute><Inbox /></AdminRoute>} />
            <Route path="newsletter" element={<AdminRoute><NewsletterList /></AdminRoute>} />
            <Route path="verify" element={<AdminRoute><VerifyTicket /></AdminRoute>} />
            <Route path="promos" element={<AdminRoute><PromoManager /></AdminRoute>} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<div className="pt-40 text-center text-gray-500 font-bold">404 - Page Not Found</div>} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;