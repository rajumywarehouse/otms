import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create Organization
  const org = await prisma.organization.upsert({
    where: { code: "OTMS-001" },
    update: {},
    create: {
      name: "OTMS Logistics Pvt Ltd",
      code: "OTMS-001",
      address: "Mumbai, Maharashtra, India",
      phone: "+91 22 1234 5678",
      email: "admin@otms.com",
      gstNumber: "27AABCT1234F1ZK",
    },
  });

  // Create Admin User
  const adminPassword = await hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@otms.com" },
    update: {},
    create: {
      email: "admin@otms.com",
      password: adminPassword,
      name: "System Admin",
      role: "SUPER_ADMIN",
      phone: "+919876543210",
      organizationId: org.id,
    },
  });

  // Create Dispatcher
  const dispatcherPassword = await hash("dispatch123", 12);
  await prisma.user.upsert({
    where: { email: "dispatch@otms.com" },
    update: {},
    create: {
      email: "dispatch@otms.com",
      password: dispatcherPassword,
      name: "Ramesh Dispatcher",
      role: "DISPATCHER",
      phone: "+919876543211",
      organizationId: org.id,
    },
  });

  // Create Truck Types
  const truckTypes = [
    "Trailer", "32 Feet", "20 Feet", "14 Feet",
    "Taurus", "Open Truck", "Containerized Truck",
  ];

  for (const name of truckTypes) {
    await prisma.truckType.upsert({
      where: { id: name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: { id: name.toLowerCase().replace(/\s+/g, "-"), name },
    });
  }

  // Create Load Types
  const loadTypes = [
    "Containerized", "Non-containerized", "Raw Material",
    "Finished Goods", "Machinery", "Chemicals",
  ];

  for (const name of loadTypes) {
    await prisma.loadType.upsert({
      where: { id: name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: { id: name.toLowerCase().replace(/\s+/g, "-"), name },
    });
  }

  // Create Expense Types
  const expenseTypes = [
    "Fuel", "Toll", "Food", "Rental", "Repair", "Parking", "Miscellaneous",
  ];

  for (const name of expenseTypes) {
    await prisma.expenseType.upsert({
      where: { id: name.toLowerCase() },
      update: {},
      create: { id: name.toLowerCase(), name },
    });
  }

  // Create Unit Types
  const unitTypes = [
    "20 Feet", "40 Feet", "Boxes", "Pieces", "Bags", "Pallets",
  ];

  for (const name of unitTypes) {
    await prisma.unitType.upsert({
      where: { id: name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: { id: name.toLowerCase().replace(/\s+/g, "-"), name },
    });
  }

  // Create Sample Clients
  const clients = [
    { name: "Tata Steel", city: "Mumbai", gst: "27AAACT1234F1ZQ" },
    { name: "Reliance Industries", city: "Mumbai", gst: "27AABCR1234F1Z5" },
    { name: "Infosys", city: "Bangalore", gst: "29AABCI1234F1ZP" },
    { name: "Wipro", city: "Bangalore", gst: "29AABCW1234F1Z7" },
    { name: "HCL Tech", city: "Noida", gst: "09AABCH1234F1ZX" },
  ];

  for (const client of clients) {
    await prisma.client.create({
      data: {
        name: client.name,
        city: client.city,
        gstNumber: client.gst,
        organizationId: org.id,
      },
    });
  }

  // Create Sample Trucks
  const sampleTrucks = [
    { number: "MH12AB1234", type: "32-feet", capacity: 15 },
    { number: "MH04CD5678", type: "trailer", capacity: 25 },
    { number: "KA01EF9012", type: "20-feet", capacity: 9 },
    { number: "TN02GH3456", type: "containerized-truck", capacity: 20 },
    { number: "DL03IJ7890", type: "open-truck", capacity: 12 },
  ];

  for (const truck of sampleTrucks) {
    await prisma.truck.create({
      data: {
        truckNumber: truck.number,
        truckTypeId: truck.type,
        capacity: truck.capacity,
        organizationId: org.id,
        currentLat: 19.076 + Math.random() * 10,
        currentLng: 72.877 + Math.random() * 5,
      },
    });
  }

  // Create Sample Drivers
  const sampleDrivers = [
    { name: "Rajesh Kumar", phone: "+919800000001" },
    { name: "Suresh Patil", phone: "+919800000002" },
    { name: "Anil Singh", phone: "+919800000003" },
    { name: "Mohan Das", phone: "+919800000004" },
    { name: "Ravi Sharma", phone: "+919800000005" },
  ];

  for (const driver of sampleDrivers) {
    const driverPassword = await hash("driver123", 12);
    const user = await prisma.user.create({
      data: {
        email: `${driver.name.toLowerCase().replace(/\s+/g, ".")}@otms.com`,
        password: driverPassword,
        name: driver.name,
        role: "DRIVER",
        phone: driver.phone,
        organizationId: org.id,
      },
    });

    await prisma.driver.create({
      data: {
        name: driver.name,
        phone: driver.phone,
        userId: user.id,
        organizationId: org.id,
        licenseNumber: `MH-${Math.floor(Math.random() * 99)}-${Math.floor(Math.random() * 9999999)}`,
        licenseExpiry: new Date("2026-12-31"),
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
