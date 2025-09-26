
import { PatientJourney } from '../types';

export const journeyData: PatientJourney[] = [
  {
    id: 1,
    title: "New Botox Patient (High Satisfaction)",
    description: "A successful journey of a first-time Botox patient who was initially nervous but became a happy, returning client.",
    patientProfile: { name: "Sarah J.", age: 38, concern: "Forehead Wrinkles" },
    events: [
      { type: 'Inquiry', title: "Online Booking", date: "Aug 1, 2024", summary: "Patient booked a 'New Patient Consultation' via the website after searching for 'Botox near me'." },
      { type: 'Consultation', title: "Initial Consult", date: "Aug 5, 2024", summary: "Expressed nervousness about looking 'frozen'. Provider spent extra time on education, showing natural-looking before/after photos." },
      { type: 'Treatment', title: "Botox Treatment", date: "Aug 5, 2024", summary: "A conservative dose of 20 units was administered to the glabella and forehead. Patient reported minimal discomfort." },
      { type: 'Follow-up', title: "2-Week Follow-up Call", date: "Aug 19, 2024", summary: "Patient reported loving the 'refreshed' look and felt the results were very natural. No adjustments were needed." },
      { type: 'Satisfaction', title: "High Satisfaction", date: "Aug 19, 2024", summary: "Patient left a 5-star review online and pre-booked their next appointment in 3 months. Satisfaction score: 98%." },
    ],
  },
  {
    id: 2,
    title: "Filler Patient with Cost Objections",
    description: "A journey detailing how a provider successfully handled cost objections for dermal fillers, leading to a conversion.",
    patientProfile: { name: "Maria G.", age: 52, concern: "Volume Loss" },
    events: [
      { type: 'Consultation', title: "Filler Consultation", date: "Aug 8, 2024", summary: "Patient interested in cheek and lip fillers to address age-related volume loss. A plan involving 2 syringes of filler was recommended." },
      { type: 'Objection', title: "Cost Objection Raised", date: "Aug 8, 2024", summary: "Patient expressed concern that the total cost was higher than anticipated and was hesitant to proceed." },
      { type: 'Resolution', title: "Objection Handled", date: "Aug 8, 2024", summary: "Provider acknowledged the concern, explained the value and longevity of the treatment, and offered a financing plan. A staged approach (1 syringe now, 1 later) was also proposed." },
      { type: 'Treatment', title: "Staged Treatment Plan", date: "Aug 8, 2024", summary: "Patient agreed to start with one syringe in the cheeks and was very happy with the immediate, subtle lift." },
      { type: 'Follow-up', title: "Scheduled Next Stage", date: "Aug 22, 2024", summary: "During follow-up, patient was thrilled and booked an appointment for the second syringe for their lips." },
    ],
  },
  {
    id: 3,
    title: "Acne Scar Patient (Multi-Session Plan)",
    description: "Illustrates the long-term journey of a patient undergoing a multi-session treatment plan for textural improvements.",
    patientProfile: { name: "David L.", age: 29, concern: "Acne Scarring" },
    events: [
        { type: 'Consultation', title: "Scarring Consultation", date: "Jul 15, 2024", summary: "Patient had significant textural scarring on cheeks. A multi-modal plan of 3 microneedling sessions and 1 laser resurfacing treatment was recommended." },
        { type: 'Treatment', title: "Microneedling Session 1", date: "Jul 20, 2024", summary: "First session completed. Patient was educated on post-procedure care and the importance of consistency." },
        { type: 'Treatment', title: "Microneedling Session 2", date: "Aug 18, 2024", summary: "Noticeable improvement in skin texture. Patient is motivated and seeing early results." },
        { type: 'Treatment', title: "Microneedling Session 3", date: "Sep 15, 2024", summary: "Final microneedling session. Skin texture is significantly smoother." },
        { type: 'Follow-up', title: "Plan for Laser", date: "Sep 15, 2024", summary: "Patient is happy with progress and has scheduled the final laser resurfacing session to address deeper scars." },
    ],
  },
];
