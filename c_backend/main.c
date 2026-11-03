/*
 * ============================================================================
 * PROJECT NAME: 8TH FLOOR – Hostel Grievance Management System
 * TAGLINE: A Better Hostel Begins Here.
 * 
 * STUDENT DETAILS:
 * - Student Name: Piyush Joshi
 * - UID: 26BCD10227
 * - Section: 26BCD4A
 * - University: Chandigarh University
 * - Submitted To: Khushi Aggarwal Ma'am (Assistant Professor)
 * - Subject: Computer Programming / Data Structures using C
 * 
 * DESCRIPTION:
 * This C program acts as the backend for the 8TH FLOOR Hostel Grievance
 * Management System. It uses C Data Structures (Structures, Arrays, File
 * Handling, Searching, Updating, Deletion) to manage hostel complaints.
 * 
 * DATA STORAGE: Binary file "complaints.dat"
 * ============================================================================
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_COMPLAINTS 100
#define FILE_NAME "complaints.dat"

/* Structure to store Complaint Record */
struct Complaint {
    int id;
    char studentName[50];
    char uid[20];
    char roomNo[15];
    char category[30];
    char description[300];
    char status[20];
};

/* Function Prototypes */
void addComplaint(const char* name, const char* uid, const char* room, const char* category, const char* desc);
void viewComplaints(int jsonOutput);
void searchComplaint(int id, int jsonOutput);
void updateStatus(int id, const char* newStatus);
void deleteComplaint(int id);
int generateNextId();
void interactiveMenu();

/* Helper function to clean strings and trim newlines */
void trimNewline(char* str) {
    size_t len = strlen(str);
    if (len > 0 && str[len - 1] == '\n') {
        str[len - 1] = '\0';
    }
}

/* Helper function to escape JSON characters */
void printEscapedJsonString(const char* str) {
    for (int i = 0; str[i] != '\0'; i++) {
        if (str[i] == '"') {
            printf("\\\"");
        } else if (str[i] == '\\') {
            printf("\\\\");
        } else if (str[i] == '\n') {
            printf("\\n");
        } else if (str[i] == '\r') {
            printf("\\r");
        } else if (str[i] == '\t') {
            printf("\\t");
        } else {
            putchar(str[i]);
        }
    }
}

/* Function 1: Generate next unique Complaint ID starting from 101 */
int generateNextId() {
    FILE* file = fopen(FILE_NAME, "rb");
    if (file == NULL) {
        return 101; /* First complaint starts at ID 101 */
    }

    struct Complaint c;
    int maxId = 100;

    /* Read through the file using fread() */
    while (fread(&c, sizeof(struct Complaint), 1, file) == 1) {
        if (c.id > maxId) {
            maxId = c.id;
        }
    }

    fclose(file);
    return maxId + 1;
}

/* Function 2: Add a new complaint to complaints.dat using File Handling */
void addComplaint(const char* name, const char* uid, const char* room, const char* category, const char* desc) {
    FILE* file = fopen(FILE_NAME, "ab"); /* Open file in append binary mode */
    if (file == NULL) {
        /* If file does not exist, open in write binary mode */
        file = fopen(FILE_NAME, "wb");
    }

    if (file == NULL) {
        printf("{\"status\": \"error\", \"message\": \"Failed to open data file for writing.\"}\n");
        return;
    }

    struct Complaint newComp;
    newComp.id = generateNextId();
    
    strncpy(newComp.studentName, name, sizeof(newComp.studentName) - 1);
    newComp.studentName[sizeof(newComp.studentName) - 1] = '\0';

    strncpy(newComp.uid, uid, sizeof(newComp.uid) - 1);
    newComp.uid[sizeof(newComp.uid) - 1] = '\0';

    strncpy(newComp.roomNo, room, sizeof(newComp.roomNo) - 1);
    newComp.roomNo[sizeof(newComp.roomNo) - 1] = '\0';

    strncpy(newComp.category, category, sizeof(newComp.category) - 1);
    newComp.category[sizeof(newComp.category) - 1] = '\0';

    strncpy(newComp.description, desc, sizeof(newComp.description) - 1);
    newComp.description[sizeof(newComp.description) - 1] = '\0';

    strcpy(newComp.status, "Pending"); /* Default status is Pending */

    /* Write struct record to binary file */
    fwrite(&newComp, sizeof(struct Complaint), 1, file);
    fclose(file);

    /* Output JSON result for CGI/Web API */
    printf("{\"status\": \"success\", \"message\": \"Complaint submitted successfully!\", \"id\": %d}\n", newComp.id);
}

/* Function 3: View all complaints stored in complaints.dat using File Handling & Array of Structs */
void viewComplaints(int jsonOutput) {
    FILE* file = fopen(FILE_NAME, "rb");
    if (file == NULL) {
        if (jsonOutput) {
            printf("[]\n");
        } else {
            printf("\n=========================================\n");
            printf("  8TH FLOOR - HOSTEL GRIEVANCE RECORDS   \n");
            printf("=========================================\n");
            printf("No complaints submitted yet.\n\n");
        }
        return;
    }

    struct Complaint complaintsList[MAX_COMPLAINTS];
    int count = 0;

    /* Read records into array of structures */
    while (count < MAX_COMPLAINTS && fread(&complaintsList[count], sizeof(struct Complaint), 1, file) == 1) {
        count++;
    }
    fclose(file);

    if (count == 0) {
        if (jsonOutput) {
            printf("[]\n");
        } else {
            printf("\n=========================================\n");
            printf("  8TH FLOOR - HOSTEL GRIEVANCE RECORDS   \n");
            printf("=========================================\n");
            printf("No complaints submitted yet.\n\n");
        }
        return;
    }

    if (jsonOutput) {
        printf("[\n");
        for (int i = 0; i < count; i++) {
            printf("  {\n");
            printf("    \"id\": %d,\n", complaintsList[i].id);
            printf("    \"studentName\": \""); printEscapedJsonString(complaintsList[i].studentName); printf("\",\n");
            printf("    \"uid\": \""); printEscapedJsonString(complaintsList[i].uid); printf("\",\n");
            printf("    \"roomNo\": \""); printEscapedJsonString(complaintsList[i].roomNo); printf("\",\n");
            printf("    \"category\": \""); printEscapedJsonString(complaintsList[i].category); printf("\",\n");
            printf("    \"description\": \""); printEscapedJsonString(complaintsList[i].description); printf("\",\n");
            printf("    \"status\": \""); printEscapedJsonString(complaintsList[i].status); printf("\"\n");
            printf("  }%s\n", (i == count - 1) ? "" : ",");
        }
        printf("]\n");
    } else {
        printf("\n========================================================================================\n");
        printf("                      8TH FLOOR HOSTEL GRIEVANCE RECORDS (%d Total)                      \n", count);
        printf("========================================================================================\n");
        printf("%-6s | %-18s | %-12s | %-8s | %-16s | %-10s\n", "ID", "Student Name", "UID", "Room", "Category", "Status");
        printf("----------------------------------------------------------------------------------------\n");
        for (int i = 0; i < count; i++) {
            printf("#%-5d | %-18s | %-12s | %-8s | %-16s | %-10s\n", 
                complaintsList[i].id, 
                complaintsList[i].studentName, 
                complaintsList[i].uid, 
                complaintsList[i].roomNo, 
                complaintsList[i].category, 
                complaintsList[i].status);
            printf("       Description: %s\n", complaintsList[i].description);
            printf("----------------------------------------------------------------------------------------\n");
        }
    }
}

/* Function 4: Search for a complaint by Complaint ID using Linear Search */
void searchComplaint(int id, int jsonOutput) {
    FILE* file = fopen(FILE_NAME, "rb");
    if (file == NULL) {
        if (jsonOutput) {
            printf("{\"status\": \"error\", \"message\": \"No complaints file found.\"}\n");
        } else {
            printf("\nComplaint ID #%d not found. File is empty.\n", id);
        }
        return;
    }

    struct Complaint c;
    int found = 0;

    /* Perform Linear Search over file records */
    while (fread(&c, sizeof(struct Complaint), 1, file) == 1) {
        if (c.id == id) {
            found = 1;
            break;
        }
    }
    fclose(file);

    if (found) {
        if (jsonOutput) {
            printf("{\n");
            printf("  \"id\": %d,\n", c.id);
            printf("  \"studentName\": \""); printEscapedJsonString(c.studentName); printf("\",\n");
            printf("  \"uid\": \""); printEscapedJsonString(c.uid); printf("\",\n");
            printf("  \"roomNo\": \""); printEscapedJsonString(c.roomNo); printf("\",\n");
            printf("  \"category\": \""); printEscapedJsonString(c.category); printf("\",\n");
            printf("  \"description\": \""); printEscapedJsonString(c.description); printf("\",\n");
            printf("  \"status\": \""); printEscapedJsonString(c.status); printf("\"\n");
            printf("}\n");
        } else {
            printf("\n--- COMPLAINT RECORD FOUND ---\n");
            printf("Complaint ID : #%d\n", c.id);
            printf("Student Name : %s\n", c.studentName);
            printf("UID          : %s\n", c.uid);
            printf("Room Number  : %s\n", c.roomNo);
            printf("Category     : %s\n", c.category);
            printf("Status       : %s\n", c.status);
            printf("Description  : %s\n", c.description);
            printf("------------------------------\n");
        }
    } else {
        if (jsonOutput) {
            printf("{\"status\": \"error\", \"message\": \"Complaint ID not found.\"}\n");
        } else {
            printf("\nComplaint ID #%d was not found in the records.\n", id);
        }
    }
}

/* Function 5: Update the status of a complaint by Complaint ID */
void updateStatus(int id, const char* newStatus) {
    FILE* file = fopen(FILE_NAME, "rb+"); /* Open in read/write binary mode */
    if (file == NULL) {
        printf("{\"status\": \"error\", \"message\": \"Data file not found.\"}\n");
        return;
    }

    struct Complaint c;
    int found = 0;
    long pos = 0;

    /* Scan binary file records to locate Complaint ID */
    while (fread(&c, sizeof(struct Complaint), 1, file) == 1) {
        if (c.id == id) {
            found = 1;
            /* Move file pointer back to the beginning of this record */
            fseek(file, pos, SEEK_SET);

            /* Update status field */
            strncpy(c.status, newStatus, sizeof(c.status) - 1);
            c.status[sizeof(c.status) - 1] = '\0';

            /* Overwrite record in binary file */
            fwrite(&c, sizeof(struct Complaint), 1, file);
            break;
        }
        pos = ftell(file); /* Track byte position of next record */
    }

    fclose(file);

    if (found) {
        printf("{\"status\": \"success\", \"message\": \"Status updated successfully for ID #%d to %s.\"}\n", id, newStatus);
    } else {
        printf("{\"status\": \"error\", \"message\": \"Complaint ID #%d not found for update.\"}\n", id);
    }
}

/* Function 6: Delete a complaint record by Complaint ID (File Compaction) */
void deleteComplaint(int id) {
    FILE* file = fopen(FILE_NAME, "rb");
    if (file == NULL) {
        printf("{\"status\": \"error\", \"message\": \"Data file not found.\"}\n");
        return;
    }

    FILE* tempFile = fopen("temp.dat", "wb");
    if (tempFile == NULL) {
        fclose(file);
        printf("{\"status\": \"error\", \"message\": \"Failed to create temporary file.\"}\n");
        return;
    }

    struct Complaint c;
    int found = 0;

    /* Read all records; copy non-matching records to temp file */
    while (fread(&c, sizeof(struct Complaint), 1, file) == 1) {
        if (c.id == id) {
            found = 1; /* Skip this record (deletion) */
        } else {
            fwrite(&c, sizeof(struct Complaint), 1, tempFile);
        }
    }

    fclose(file);
    fclose(tempFile);

    /* Replace original file with temporary file */
    remove(FILE_NAME);
    rename("temp.dat", FILE_NAME);

    if (found) {
        printf("{\"status\": \"success\", \"message\": \"Complaint ID #%d deleted successfully.\"}\n", id);
    } else {
        printf("{\"status\": \"error\", \"message\": \"Complaint ID #%d not found for deletion.\"}\n", id);
    }
}

/* Interactive Console Menu for University Viva Demonstration */
void interactiveMenu() {
    int choice, searchId, updateId, deleteId;
    char name[50], uid[20], room[15], category[30], desc[300], status[20];

    while (1) {
        printf("\n========================================================\n");
        printf("   8TH FLOOR - HOSTEL GRIEVANCE MANAGEMENT SYSTEM (C)   \n");
        printf("   Student: Piyush Joshi | UID: 26BCD10227              \n");
        printf("   Chandigarh University | Subject: Computer Programming \n");
        printf("========================================================\n");
        printf("1. Add New Complaint\n");
        printf("2. View All Complaints\n");
        printf("3. Search Complaint by ID\n");
        printf("4. Update Complaint Status (Warden)\n");
        printf("5. Delete Complaint (Warden)\n");
        printf("6. Exit Console Application\n");
        printf("--------------------------------------------------------\n");
        printf("Enter your choice (1-6): ");
        if (scanf("%d", &choice) != 1) {
            break;
        }
        getchar(); /* Consume newline */

        switch (choice) {
            case 1:
                printf("\n--- ADD NEW COMPLAINT ---\n");
                printf("Enter Student Name: ");
                if (fgets(name, sizeof(name), stdin)) { trimNewline(name); }
                
                printf("Enter UID: ");
                if (fgets(uid, sizeof(uid), stdin)) { trimNewline(uid); }

                printf("Enter Room Number: ");
                if (fgets(room, sizeof(room), stdin)) { trimNewline(room); }

                printf("Enter Category (e.g. Electricity, Plumbing, Hygiene): ");
                if (fgets(category, sizeof(category), stdin)) { trimNewline(category); }

                printf("Enter Complaint Description: ");
                if (fgets(desc, sizeof(desc), stdin)) { trimNewline(desc); }

                addComplaint(name, uid, room, category, desc);
                break;

            case 2:
                viewComplaints(0); /* Standard text output */
                break;

            case 3:
                printf("\nEnter Complaint ID to Search: ");
                if (scanf("%d", &searchId) == 1) {
                    searchComplaint(searchId, 0);
                }
                break;

            case 4:
                printf("\nEnter Complaint ID to Update: ");
                if (scanf("%d", &updateId) == 1) {
                    getchar();
                    printf("Enter New Status (Pending / Completed): ");
                    if (fgets(status, sizeof(status), stdin)) { trimNewline(status); }
                    updateStatus(updateId, status);
                }
                break;

            case 5:
                printf("\nEnter Complaint ID to Delete: ");
                if (scanf("%d", &deleteId) == 1) {
                    deleteComplaint(deleteId);
                }
                break;

            case 6:
                printf("\nExiting 8TH FLOOR Grievance Backend System. Goodbye!\n\n");
                return;

            default:
                printf("\nInvalid choice! Please enter a number between 1 and 6.\n");
        }
    }
}

/* Main Function: Routes CLI arguments or launches Interactive Menu */
int main(int argc, char *argv[]) {
    if (argc < 2) {
        interactiveMenu();
        return 0;
    }

    const char* command = argv[1];

    if (strcmp(command, "add") == 0) {
        if (argc < 7) {
            printf("{\"status\": \"error\", \"message\": \"Usage: ./hostel_backend add <Name> <UID> <Room> <Category> <Description>\"}\n");
            return 1;
        }
        addComplaint(argv[2], argv[3], argv[4], argv[5], argv[6]);
    } 
    else if (strcmp(command, "view_json") == 0 || strcmp(command, "view") == 0) {
        viewComplaints(1); /* 1 = output clean JSON array */
    } 
    else if (strcmp(command, "search") == 0) {
        if (argc < 3) {
            printf("{\"status\": \"error\", \"message\": \"Usage: ./hostel_backend search <ID>\"}\n");
            return 1;
        }
        searchComplaint(atoi(argv[2]), 1);
    } 
    else if (strcmp(command, "update") == 0) {
        if (argc < 4) {
            printf("{\"status\": \"error\", \"message\": \"Usage: ./hostel_backend update <ID> <Status>\"}\n");
            return 1;
        }
        updateStatus(atoi(argv[2]), argv[3]);
    } 
    else if (strcmp(command, "delete") == 0) {
        if (argc < 3) {
            printf("{\"status\": \"error\", \"message\": \"Usage: ./hostel_backend delete <ID>\"}\n");
            return 1;
        }
        deleteComplaint(atoi(argv[2]));
    } 
    else if (strcmp(command, "interactive") == 0) {
        interactiveMenu();
    } 
    else {
        printf("{\"status\": \"error\", \"message\": \"Unknown C command '%s'.\"}\n", command);
        return 1;
    }

    return 0;
}
