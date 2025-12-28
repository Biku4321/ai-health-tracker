import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileSetup = () => {
  const { user, login } = useAuth(); // We update the user context after saving
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    goal: 'General Fitness',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // In a real app, call your API service here:
    // const res = await axios.put('/api/auth/profile', formData, { headers: { Authorization: `Bearer ${user.token}` } });
    
    // Simulating API success for demo:
    console.log("Profile Updated:", formData);
    login({ ...user, ...formData }); // Update local context
    navigate('/dashboard'); // Redirect to main app
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7F8] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#1A3C40] to-[#2D5C63] p-6 text-center">
          <h2 className="text-3xl font-poppins font-bold text-white mb-2">
            Let's Personalize
          </h2>
          <p className="text-[#4EC5C1] text-sm">
            Help our AI understand your body & goals.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 text-sm font-semibold mb-1">Age</label>
              <input
                type="number"
                name="age"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4EC5C1] outline-none bg-gray-50"
                placeholder="25"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-semibold mb-1">Gender</label>
              <select
                name="gender"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4EC5C1] outline-none bg-gray-50"
                onChange={handleChange}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 text-sm font-semibold mb-1">Height (cm)</label>
              <input
                type="number"
                name="height"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4EC5C1] outline-none bg-gray-50"
                placeholder="175"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-semibold mb-1">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4EC5C1] outline-none bg-gray-50"
                placeholder="70"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 text-sm font-semibold mb-1">Primary Goal</label>
            <select
              name="goal"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4EC5C1] outline-none bg-gray-50"
              onChange={handleChange}
            >
              <option>General Fitness</option>
              <option>Weight Loss</option>
              <option>Weight Gain</option>
              <option>Mental Wellness</option>
              <option>Build Muscle</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#4EC5C1] text-[#1A3C40] font-bold py-3 rounded-xl hover:bg-[#3daea9] transition duration-300 shadow-md mt-4"
          >
            Complete Setup 🚀
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
// import { useState } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import authService from '../../services/authService'; // Use authService
// import { Save } from 'lucide-react';

// const Settings = () => {
//   const { user, login } = useAuth(); // login updates the context
//   const [formData, setFormData] = useState({
//     name: user?.name || '',
//     email: user?.email || '',
//     age: user?.age || '',
//     height: user?.height || '',
//     weight: user?.weight || '',
//     goal: user?.goal || 'General Fitness'
//   });

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       // Calls PUT /api/auth/profile
//       const updatedUser = await authService.updateProfile(formData);
//       login(updatedUser); // Update global context with new data
//       alert("✅ Profile Updated Successfully!");
//     } catch (error) {
//       alert("❌ Update failed");
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto space-y-6">
//       <h1 className="text-3xl font-bold text-secondary dark:text-white">Settings</h1>
      
//       <form onSubmit={handleUpdate} className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-glass border border-gray-100 dark:border-gray-700 space-y-4">
//         <h2 className="font-bold text-lg mb-4 text-secondary dark:text-white">Profile Details</h2>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
//             <input 
//               type="text" 
//               value={formData.name} 
//               onChange={(e) => setFormData({...formData, name: e.target.value})}
//               className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-white"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Goal</label>
//             <select 
//               value={formData.goal}
//               onChange={(e) => setFormData({...formData, goal: e.target.value})}
//               className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-white"
//             >
//               <option>General Fitness</option>
//               <option>Weight Loss</option>
//               <option>Weight Gain</option>
//               <option>Mental Wellness</option>
//             </select>
//           </div>
//           {/* Add inputs for Age, Height, Weight similarly */}
//         </div>

//         <button type="submit" className="bg-primary text-secondary px-6 py-3 rounded-xl font-bold hover:bg-[#3daea9] transition flex items-center gap-2">
//           <Save size={18} /> Save Changes
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Settings;