// src/data/permissions.ts
export const permissionCategories = {
  "Questionnaires": [
    { id: "questionnaire:view", label: "View Questionnaires" },
    { id: "questionnaire:create", label: "Create Questionnaires" },
    { id: "questionnaire:edit", label: "Edit Draft Questionnaires" },
    { id: "questionnaire:publish", label: "Publish Questionnaires" },
    { id: "questionnaire:archive", label: "Archive Questionnaires" },
    { id: "questionnaire:delete", label: "Delete Questionnaires" },
  ],
  "Assessment Bank": [
    { id: "bank:view", label: "View Question Bank" },
    { id: "bank:create", label: "Create Questions" },
    { id: "bank:edit", label: "Edit Questions" },
    { id: "bank:delete", label: "Delete Questions" },
  ],
  "User Submissions": [
    { id: "submission:view", label: "View User Submissions" },
    { id: "submission:review", label: "Review & Grade Submissions" },
  ],
  "Operational Partners": [
    { id: "partner:view", label: "View Operational Partners" },
    { id: "partner:create", label: "Add Operational Partners" },
    { id: "partner:edit", label: "Edit Operational Partners" },
    { id: "partner:assign_review", label: "Assign Question Review Sets" },
  ],
  "Manage Admins": [
    { id: "admin:view", label: "View Admins" },
    { id: "admin:create", label: "Invite Admins" },
    { id: "admin:edit_roles", label: "Edit Admin Roles & Permissions" },
  ],
  "Faculty Portal": [
    { id: "faculty:review_questions", label: "Access Faculty Portal to Review Questions" }
  ]
};