'use client'

import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import { TextLink } from 'solito/link'

export function DetailsScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f9fafb' }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Header */}
      <View
        style={{
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1557804506-669a67965ba0',
          }}
          style={{
            width: '100%',
            height: 200,
            borderRadius: 12,
          }}
        />
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            marginTop: 16,
            color: '#111827',
          }}
        >
          Full-Stack Web Development
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: '#6b7280',
            marginTop: 4,
            textAlign: 'center',
          }}
        >
          Master React, Next.js, Node.js & more in 12 weeks
        </Text>
      </View>

      {/* Course Info */}
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 5,
        }}
      >
        <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 8 }}>
          About this Course
        </Text>
        <Text style={{ color: '#374151', lineHeight: 22 }}>
          This course is designed for beginners who want to become professional
          web developers. You’ll learn everything from responsive front-end
          design with React to powerful server-side logic using Node.js and
          Express.
        </Text>
      </View>

      {/* Lessons */}
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 8 }}>
          Course Modules
        </Text>
        {[
          '1. HTML & CSS Fundamentals',
          '2. JavaScript Deep Dive',
          '3. React & Hooks',
          '4. Next.js for Production',
          '5. Backend with Node.js',
          '6. MongoDB & APIs',
        ].map((module, i) => (
          <Text key={i} style={{ color: '#374151', marginBottom: 4 }}>
            {module}
          </Text>
        ))}
      </View>

      {/* CTA */}
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#2563eb',
            paddingVertical: 12,
            paddingHorizontal: 40,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            Enroll Now
          </Text>
        </TouchableOpacity>

        <TextLink
          href="/"
          style={{
            marginTop: 16,
            color: '#2563eb',
            fontWeight: '600',
            fontSize: 16,
          }}
        >
          ← Back to Home
        </TextLink>
      </View>
    </ScrollView>
  )
}
