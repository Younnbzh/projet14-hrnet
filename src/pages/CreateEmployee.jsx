import { useState } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Modal from '@lionel-ocs/hrnet-modal';
import { states } from '../assets/data/states';
import '../assets/css/pages/CreateEmployee.css';
import 'react-datepicker/dist/react-datepicker.css';
/**
 * CreateEmployee Component
 * This component renders a form for creating new employee records.
 */
const CreateEmployee = () => {
  // State to control the visibility of the confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State to manage all form input values
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    startDate: null,
    street: '',
    city: '',
    state: '',
    zipCode: '',
    department: ''
  });
  // array of available departments
  const departments = [
    'Sales',
    'Marketing',
    'Engineering',
    'Human Resources',
    'Legal'
  ];
  // Handles input changes for text fields and select elements into formData state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // handles date changes for both dateOfBirth and startDate fields into formData state
  const handleDateChange = (date, fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: date
    }));
  };
  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Get existing employees from localStorage or initialize an empty array
    const existingEmployees = JSON.parse(localStorage.getItem('employees')) || [];
    // Format dates for storage (MM/DD/YYYY)
    const formatDate = (date) => {
      if (!date) return '';
      return date.toLocaleDateString('en-US');
    };
    // Create new employee object with formatted dates and unique ID
    const newEmployee = {
      ...formData,
      dateOfBirth: formatDate(formData.dateOfBirth),
      startDate: formatDate(formData.startDate),
      id: Date.now() // timestamp id generation
    };
    // Add new employee to existing list and save to localStorage
    existingEmployees.push(newEmployee);
    localStorage.setItem('employees', JSON.stringify(existingEmployees));

    // Show confirmation modal
    setIsModalOpen(true);

    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: null,
      startDate: null,
      street: '',
      city: '',
      state: '',
      zipCode: '',
      department: ''
    });
  };
  // close the confirmation modal when user clicks ok
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="create-employee">
      <div className="title">
        <h1>HRnet</h1>
      </div>

      <div className="container">
        <Link to="/employee-list" className="view-employees-link">
          View Current Employees
        </Link>

        <h2>Create Employee</h2>

        <form onSubmit={handleSubmit} className="employee-form">
          {/* First Name input field */}
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
          </div>
          {/* Last Name input field */}
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
          </div>
          {/* Date of Birth picker with dropdown navigation */}
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <DatePicker
              selected={formData.dateOfBirth}
              onChange={(date) => handleDateChange(date, 'dateOfBirth')}
              dateFormat="MM/dd/yyyy"
              placeholderText="Select date of birth"
              className="date-picker-input"
              showPopperArrow={false}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              yearDropdownItemNumber={100}
              maxDate={new Date()}
              required
            />
          </div>
          {/* Start Date picker with dropdown navigation */}
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date) => handleDateChange(date, 'startDate')}
              dateFormat="MM/dd/yyyy"
              placeholderText="Select start date"
              className="date-picker-input"
              showPopperArrow={false}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              minDate={new Date(1990, 0, 1)}
              maxDate={new Date()}
              required
            />
          </div>

          <fieldset className="address-fieldset">
            <legend>Address</legend>
            {/* Street address input */}
            <div className="form-group">
              <label htmlFor="street">Street</label>
              <input type="text" id="street" name="street" value={formData.street} onChange={handleInputChange} required />
            </div>
            {/* City input */}
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} required />
            </div>
            {/* State dropdown populated from imported states data */}
            <div className="form-group">
              <label htmlFor="state">State</label>
              <select id="state" name="state" value={formData.state} onChange={handleInputChange} required>
                <option value="">Select a state</option>
                {states.map(state => (
                  <option key={state.abbreviation} value={state.abbreviation}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Zip Code input */}
            <div className="form-group">
              <label htmlFor="zipCode">Zip Code</label>
              <input type="number" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
            </div>
          </fieldset>
          {/* Department dropdown populated from departments array */}
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select id="department" name="department" value={formData.department} onChange={handleInputChange} required>
              <option value="">Select a department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          {/* Form submission button */}
          <button type="submit" className="save-button">
            Save
          </button>
        </form>
      </div>

      {/* Confirmation Modal displayed after successful form submit */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        modalContent={
          <div className="modal-content-body">
            <h3>Success!</h3>
            <p>Employee has been created successfully.</p>
            <button onClick={closeModal} className="modal-ok-button">
              OK
            </button>
          </div>
        }
      />
    </div>
  );
};

export default CreateEmployee;