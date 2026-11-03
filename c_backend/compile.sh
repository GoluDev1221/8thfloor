#!/bin/bash
# Compilation script for 8TH FLOOR Hostel Grievance Management System C Backend
# Student: Piyush Joshi (UID: 26BCD10227) - Chandigarh University

echo "=========================================================="
echo " Compiling C Backend for 8TH FLOOR Hostel System...      "
echo "=========================================================="

gcc -Wall -O2 c_backend/main.c -o c_backend/hostel_backend

if [ $? -eq 0 ]; then
    echo "[SUCCESS] C Binary compiled successfully to 'c_backend/hostel_backend'"
    echo "To test interactive console menu, run: ./c_backend/hostel_backend"
else
    echo "[ERROR] GCC Compilation failed. Please ensure GCC is installed."
fi
