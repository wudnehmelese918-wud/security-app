import { User } from '../models/user.model';
import { Equipment } from '../models/equipment.model';
import { ExitLog } from '../models/exitLog.model';

export const seedDatabase = async (): Promise<void> => {
  try {
    // 1. Seed Users if not present
    let admin = await User.findOne({ email: 'admin@dbu.edu.et' });
    if (!admin) {
      admin = await User.create({
        fullName: 'Dr. Solomon Haile',
        email: 'admin@dbu.edu.et',
        password: 'password123',
        role: 'admin',
        isActive: true,
      });
      console.log('🌱 Seeded Admin user: admin@dbu.edu.et / password123');
    }

    let guard = await User.findOne({ email: 'guard@dbu.edu.et' });
    if (!guard) {
      guard = await User.create({
        fullName: 'Tadesse Bekele',
        email: 'guard@dbu.edu.et',
        password: 'password123',
        role: 'assistant',
        isActive: true,
      });
      console.log('🌱 Seeded Guard user: guard@dbu.edu.et / password123');
    }

    const guest = await User.findOne({ email: 'guest@dbu.edu.et' });
    if (!guest) {
      await User.create({
        fullName: 'Visitor Auditor',
        email: 'guest@dbu.edu.et',
        password: 'password123',
        role: 'guest',
        isActive: true,
      });
      console.log('🌱 Seeded Guest user: guest@dbu.edu.et / password123');
    }

    // 2. Seed Equipment if empty
    const count = await Equipment.countDocuments();
    if (count === 0) {
      const sampleEquipment = [
        {
          assetId: 'DBULT0001',
          equipmentType: 'laptop',
          brand: 'HP',
          model: 'ProBook 450 G8',
          serialNumber: 'SN-HP849201',
          color: 'Silver',
          ownerType: 'student',
          ownerName: 'Abebe Kebede Tesfaye',
          universityId: 'DBU1402931',
          department: 'Computer Science',
          year: '4',
          blockNumber: 'B12',
          dormNumber: '304',
          status: 'inside',
          guardNotes: 'Approved student laptop. Cleared for exit during semester.',
          registeredBy: admin._id,
        },
        {
          assetId: 'DBULT0002',
          equipmentType: 'laptop',
          brand: 'Dell',
          model: 'Latitude 5420',
          serialNumber: 'SN-DL918230',
          color: 'Black',
          ownerType: 'student',
          ownerName: 'Bethlehem Tsegaye Mengistu',
          universityId: 'DBU1308291',
          department: 'Electrical Engineering',
          year: '5',
          blockNumber: 'B08',
          dormNumber: '210',
          status: 'outside',
          lastExitAt: new Date(Date.now() - 3 * 3600 * 1000),
          guardNotes: 'Exit with academic department permission.',
          registeredBy: guard._id,
        },
        {
          assetId: 'DBULT0003',
          equipmentType: 'laptop',
          brand: 'Lenovo',
          model: 'ThinkPad E14 Gen 4',
          serialNumber: 'SN-LN471928',
          color: 'Black',
          ownerType: 'student',
          ownerName: 'Dawit Alemayehu Wolde',
          universityId: 'DBU1501928',
          department: 'Information Technology',
          year: '3',
          blockNumber: 'B14',
          dormNumber: '105',
          status: 'inside',
          guardNotes: 'Personal device with university sticker.',
          registeredBy: admin._id,
        },
        {
          assetId: 'DBUPC0001',
          equipmentType: 'desktop',
          brand: 'Dell',
          model: 'OptiPlex 7090 Micro',
          serialNumber: 'SN-OP709012',
          color: 'Dark Gray',
          ownerType: 'staff',
          ownerName: 'Prof. Mekonnen Assefa',
          universityId: 'DBU-STF-042',
          department: 'Faculty of Computing',
          status: 'inside',
          guardNotes: 'University property assigned to faculty research lab.',
          registeredBy: admin._id,
        },
        {
          assetId: 'DBUTA0001',
          equipmentType: 'tablet',
          brand: 'Apple',
          model: 'iPad Air 5th Gen',
          serialNumber: 'SN-AP983210',
          color: 'Space Gray',
          ownerType: 'student',
          ownerName: 'Hiwot Girma Belay',
          universityId: 'DBU1603940',
          department: 'Medicine & Health Sciences',
          year: '2',
          blockNumber: 'B03',
          dormNumber: '401',
          status: 'inside',
          guardNotes: 'Medical student clinical tablet.',
          registeredBy: guard._id,
        },
      ];

      const inserted = await Equipment.insertMany(sampleEquipment);
      console.log(`🌱 Seeded ${inserted.length} sample equipment assets`);

      // 3. Seed sample ExitLogs
      const eqOutside = inserted.find((e) => e.status === 'outside');
      const eqInside = inserted.find((e) => e.status === 'inside');

      if (eqOutside) {
        await ExitLog.create({
          equipment: eqOutside._id,
          assetId: eqOutside.assetId,
          action: 'exit',
          scannedBy: guard._id,
          note: 'Regular student weekend exit approved at Gate 1',
          timestamp: new Date(Date.now() - 3 * 3600 * 1000),
        });
      }

      if (eqInside) {
        await ExitLog.create({
          equipment: eqInside._id,
          assetId: eqInside.assetId,
          action: 'entry',
          scannedBy: guard._id,
          note: 'Equipment returned and checked in at Gate 1',
          timestamp: new Date(Date.now() - 24 * 3600 * 1000),
        });
      }

      console.log('🌱 Seeded initial gate exit/entry logs');
    }
  } catch (error) {
    console.error('⚠️ Database seed error:', error);
  }
};
