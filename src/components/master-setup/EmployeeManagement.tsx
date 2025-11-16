"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { EmployeeForm } from "./EmployeeForm";
import { EditEmployeeForm } from "./EditEmployeeForm"; // New import
import { Employee } from "@/types"; // Import Employee type

export function EmployeeManagement() {
  const { employees } = useAppContext();
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false);
  const [isEditEmployeeDialogOpen, setIsEditEmployeeDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditEmployeeDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg"> {/* Added shadow-lg */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold text-gray-800">Existing Employees</CardTitle>
          <Dialog open={isAddEmployeeDialogOpen} onOpenChange={setIsAddEmployeeDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary-orange hover:bg-primary-orange/90 text-white shadow-lg"> {/* Orange button */}
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
              </DialogHeader>
              <EmployeeForm onEmployeeAdded={() => setIsAddEmployeeDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No employees yet.</TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>{employee.isActive ? "Active" : "Inactive"}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2 shadow-sm" // Added shadow-sm
                        onClick={() => handleEditClick(employee)}
                      >
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" className="shadow-sm">Delete</Button> {/* Added shadow-sm */}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedEmployee && (
        <Dialog open={isEditEmployeeDialogOpen} onOpenChange={setIsEditEmployeeDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
            </DialogHeader>
            <EditEmployeeForm
              employee={selectedEmployee}
              onEmployeeUpdated={() => setIsEditEmployeeDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}