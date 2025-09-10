import React from 'react'
import './SignUp.css'

const SignUp = () => {

  const [departments, setDepartments] = React.useState([
  { id: 'mohua', name: 'Ministry of Housing & Urban Affairs (MoHUA)', scope: 'Urban planning, municipal services, municipal finance and urban infrastructure' },
  { id: 'municipal', name: 'Municipal Corporation / Urban Local Bodies', scope: 'Local civic services: waste collection, streetlights, local roads, sanitation, building approvals' },
  { id: 'pwd', name: 'Public Works Department (State PWD)', scope: 'Construction and maintenance of state roads, government buildings and public infrastructure' },
  { id: 'jalshakti', name: 'Ministry of Jal Shakti', scope: 'Water resources & drinking water supply, sanitation policy and programs' },
  { id: 'moefcc', name: 'Ministry of Environment, Forest & Climate Change (MoEFCC)', scope: 'Environmental protection, pollution control, forestry and environmental clearances' },
  { id: 'power', name: 'Ministry of Power / State DISCOMs', scope: 'Electricity generation/transmission policy and distribution (power outages, street lighting)' },
  { id: 'rto', name: 'Ministry of Road Transport & Highways / RTOs', scope: 'Road safety, vehicle regulation, national highways and transport policy' },
  { id: 'health', name: 'Ministry of Health & Family Welfare / State Health Depts', scope: 'Public health, sanitation-related health issues, disease control and health infrastructure' },
  { id: 'police', name: 'Police / Home Department (State/Central)', scope: 'Law & order, public safety, traffic enforcement and investigation' },
  { id: 'ndma', name: 'National Disaster Management Authority (NDMA) / SDMAs', scope: 'Disaster preparedness, response and recovery coordination' },
  { id: 'fire', name: 'Fire Services (State)', scope: 'Fire-fighting, rescue and related public safety services' },
  { id: 'dot', name: 'Department of Telecommunications (DoT)', scope: 'Telecom policy, public digital connectivity and telecom grievance redressal' },
  { id: 'other', name: 'Other'}
])

  return (
    <div className='signup-container'>
        <h1 id='signup-title'>Sign Up</h1>
        <form id='user-signup-form'>
            <input type='text' placeholder='Username' required></input>
            <br/>
            <input type='text' placeholder='Email' required></input>
            <br/>
            <input type='password' placeholder='Password' required></input>
        </form>
        <select id='department-select' required>
          <option value='Select Department' disabled selected hidden>Select Department</option>
          {departments.map(department => {
            return(
              <>
                <option value={department.name}>{department.name}</option>
              </>
            )
          })}
        </select>

        <span id='already-user'>Already a user? <a href='#'>Sign in</a></span>

    </div>
  )
}

export default SignUp
