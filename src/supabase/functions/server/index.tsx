import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Health check
app.get('/make-server-05eeb3cf/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// User Authentication Routes
app.post('/make-server-05eeb3cf/auth/signup', async (c) => {
  try {
    const { email, password, name, role, phone, age } = await c.req.json();
    
    // Create user account
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role, phone, age },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (authError) {
      console.log('Auth error during signup:', authError);
      return c.json({ error: authError.message }, 400);
    }

    // Store additional user data in KV store
    await kv.set(`user:${authData.user.id}`, {
      id: authData.user.id,
      email,
      name,
      role,
      phone,
      age,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    });

    console.log('User created successfully:', authData.user.id);
    return c.json({ 
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name,
        role
      }
    });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// User Profile Routes
app.get('/make-server-05eeb3cf/user/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log('Auth error while getting user profile:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json({ profile });
  } catch (error) {
    console.log('Get profile error:', error);
    return c.json({ error: 'Internal server error while fetching profile' }, 500);
  }
});

app.put('/make-server-05eeb3cf/user/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log('Auth error while updating user profile:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const updates = await c.req.json();
    const existingProfile = await kv.get(`user:${user.id}`);
    
    if (!existingProfile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const updatedProfile = {
      ...existingProfile,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user:${user.id}`, updatedProfile);

    console.log('Profile updated successfully for user:', user.id);
    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.log('Update profile error:', error);
    return c.json({ error: 'Internal server error while updating profile' }, 500);
  }
});

// Medication Management Routes
app.get('/make-server-05eeb3cf/medications', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log('Auth error while fetching medications:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const medications = await kv.getByPrefix(`medication:${user.id}:`);
    
    return c.json({ 
      medications: medications.map(med => med.value).sort((a, b) => 
        new Date(a.nextDose).getTime() - new Date(b.nextDose).getTime()
      )
    });
  } catch (error) {
    console.log('Get medications error:', error);
    return c.json({ error: 'Internal server error while fetching medications' }, 500);
  }
});

app.post('/make-server-05eeb3cf/medications', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log('Auth error while adding medication:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const medicationData = await c.req.json();
    const medicationId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const medication = {
      id: medicationId,
      userId: user.id,
      ...medicationData,
      adherence: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`medication:${user.id}:${medicationId}`, medication);

    console.log('Medication added successfully for user:', user.id);
    return c.json({ medication });
  } catch (error) {
    console.log('Add medication error:', error);
    return c.json({ error: 'Internal server error while adding medication' }, 500);
  }
});

app.put('/make-server-05eeb3cf/medications/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log('Auth error while updating medication:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const medicationId = c.req.param('id');
    const updates = await c.req.json();
    
    const existingMedication = await kv.get(`medication:${user.id}:${medicationId}`);
    
    if (!existingMedication) {
      return c.json({ error: 'Medication not found' }, 404);
    }

    const updatedMedication = {
      ...existingMedication,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`medication:${user.id}:${medicationId}`, updatedMedication);

    console.log('Medication updated successfully:', medicationId);
    return c.json({ medication: updatedMedication });
  } catch (error) {
    console.log('Update medication error:', error);
    return c.json({ error: 'Internal server error while updating medication' }, 500);
  }
});

app.delete('/make-server-05eeb3cf/medications/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log('Auth error while deleting medication:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const medicationId = c.req.param('id');
    
    await kv.del(`medication:${user.id}:${medicationId}`);

    console.log('Medication deleted successfully:', medicationId);
    return c.json({ success: true });
  } catch (error) {
    console.log('Delete medication error:', error);
    return c.json({ error: 'Internal server error while deleting medication' }, 500);
  }
});

// Medication Adherence Tracking
app.post('/make-server-05eeb3cf/medications/:id/take', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log('Auth error while recording medication taken:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const medicationId = c.req.param('id');
    const { verificationData, timestamp } = await c.req.json();
    
    // Record medication taken
    const adherenceRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      medicationId,
      takenAt: timestamp || new Date().toISOString(),
      verified: !!verificationData,
      verificationData,
      createdAt: new Date().toISOString()
    };

    await kv.set(`adherence:${user.id}:${adherenceRecord.id}`, adherenceRecord);

    // Update medication adherence score
    const medication = await kv.get(`medication:${user.id}:${medicationId}`);
    if (medication) {
      // Simple adherence calculation - in real app this would be more sophisticated
      const adherenceRecords = await kv.getByPrefix(`adherence:${user.id}:`);
      const medicationRecords = adherenceRecords.filter(record => 
        record.value.medicationId === medicationId
      );
      
      // Calculate adherence percentage (simplified)
      const adherencePercentage = Math.min(100, 75 + medicationRecords.length * 2);
      
      medication.adherence = adherencePercentage;
      medication.lastTaken = adherenceRecord.takenAt;
      
      await kv.set(`medication:${user.id}:${medicationId}`, medication);
    }

    console.log('Medication adherence recorded successfully for user:', user.id);
    return c.json({ 
      success: true, 
      adherenceRecord,
      newAdherence: medication?.adherence 
    });
  } catch (error) {
    console.log('Record medication taken error:', error);
    return c.json({ error: 'Internal server error while recording medication taken' }, 500);
  }
});

// Health Data Routes
app.get('/make-server-05eeb3cf/health-data', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log('Auth error while fetching health data:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const healthData = await kv.getByPrefix(`health:${user.id}:`);
    
    return c.json({ 
      healthData: healthData.map(data => data.value).sort((a, b) => 
        new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
      )
    });
  } catch (error) {
    console.log('Get health data error:', error);
    return c.json({ error: 'Internal server error while fetching health data' }, 500);
  }
});

app.post('/make-server-05eeb3cf/health-data', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log('Auth error while adding health data:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const healthDataInput = await c.req.json();
    const recordId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const healthRecord = {
      id: recordId,
      userId: user.id,
      ...healthDataInput,
      recordedAt: healthDataInput.recordedAt || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    await kv.set(`health:${user.id}:${recordId}`, healthRecord);

    console.log('Health data recorded successfully for user:', user.id);
    return c.json({ healthRecord });
  } catch (error) {
    console.log('Add health data error:', error);
    return c.json({ error: 'Internal server error while adding health data' }, 500);
  }
});

// Family/Caregiver Routes
app.post('/make-server-05eeb3cf/family/link', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log('Auth error while linking family member:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { memberEmail, relationship, permissions } = await c.req.json();
    
    // Create family link
    const linkId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const familyLink = {
      id: linkId,
      patientId: user.id,
      memberEmail,
      relationship,
      permissions: permissions || ['view_medications', 'view_vitals', 'receive_alerts'],
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await kv.set(`family:${user.id}:${linkId}`, familyLink);

    console.log('Family link created successfully for user:', user.id);
    return c.json({ familyLink });
  } catch (error) {
    console.log('Family link error:', error);
    return c.json({ error: 'Internal server error while linking family member' }, 500);
  }
});

// Create storage bucket for documents
const bucketName = 'make-05eeb3cf-documents';
const { data: buckets } = await supabase.storage.listBuckets();
const bucketExists = buckets?.some(bucket => bucket.name === bucketName);

if (!bucketExists) {
  const { error: createBucketError } = await supabase.storage.createBucket(bucketName, {
    public: false,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    fileSizeLimit: 10485760 // 10MB
  });
  
  if (createBucketError) {
    console.log('Error creating storage bucket:', createBucketError);
  } else {
    console.log('Storage bucket created successfully:', bucketName);
  }
}

// Document/File Upload Routes
app.post('/make-server-05eeb3cf/documents/upload', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log('Auth error while uploading document:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Note: In a real implementation, you would handle file upload from form data
    // For this demo, we'll simulate document storage
    const { fileName, fileType, category, description } = await c.req.json();
    
    const documentId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const document = {
      id: documentId,
      userId: user.id,
      fileName,
      fileType,
      category,
      description,
      uploadedAt: new Date().toISOString(),
      status: 'uploaded'
    };

    await kv.set(`document:${user.id}:${documentId}`, document);

    console.log('Document uploaded successfully for user:', user.id);
    return c.json({ document });
  } catch (error) {
    console.log('Document upload error:', error);
    return c.json({ error: 'Internal server error while uploading document' }, 500);
  }
});

app.get('/make-server-05eeb3cf/documents', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log('Auth error while fetching documents:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const documents = await kv.getByPrefix(`document:${user.id}:`);
    
    return c.json({ 
      documents: documents.map(doc => doc.value).sort((a, b) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      )
    });
  } catch (error) {
    console.log('Get documents error:', error);
    return c.json({ error: 'Internal server error while fetching documents' }, 500);
  }
});

// Notifications/Alerts Routes
app.get('/make-server-05eeb3cf/notifications', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log('Auth error while fetching notifications:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const notifications = await kv.getByPrefix(`notification:${user.id}:`);
    
    return c.json({ 
      notifications: notifications.map(notif => notif.value).sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    });
  } catch (error) {
    console.log('Get notifications error:', error);
    return c.json({ error: 'Internal server error while fetching notifications' }, 500);
  }
});

app.post('/make-server-05eeb3cf/notifications', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authorization token required' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log('Auth error while creating notification:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const notificationData = await c.req.json();
    const notificationId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const notification = {
      id: notificationId,
      userId: user.id,
      ...notificationData,
      read: false,
      createdAt: new Date().toISOString()
    };

    await kv.set(`notification:${user.id}:${notificationId}`, notification);

    console.log('Notification created successfully for user:', user.id);
    return c.json({ notification });
  } catch (error) {
    console.log('Create notification error:', error);
    return c.json({ error: 'Internal server error while creating notification' }, 500);
  }
});

console.log('HealthCare+ server started successfully');

Deno.serve(app.fetch);