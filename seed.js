require('dotenv').config();
const mongoose = require('mongoose');
const Player = require('./models/Player');
const Match = require('./models/Match');
const Blog = require('./models/Blog');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gbpl')
    .then(() => console.log('✅ Connected to DB for seeding...'))
    .catch(err => console.error('❌ DB Connection Error:', err));

const seedData = async () => {
    try {
        // 1. Clear existing data (We leave Users alone so you don't lose your admin account)
        console.log('🗑️ Clearing old players, matches, and blogs...');
        await Player.deleteMany({});
        await Match.deleteMany({});
        await Blog.deleteMany({});

        // 2. Add Fake Players
        console.log('🏏 Adding dummy players...');
        const players = [
            { name: 'Rahul Desai', matchesPlayed: 12, runs: 345, wickets: 2 },
            { name: 'Amit Patil', matchesPlayed: 12, runs: 210, wickets: 14 },
            { name: 'Sagar Joshi', matchesPlayed: 10, runs: 180, wickets: 8 },
            { name: 'Rohan Kadam', matchesPlayed: 11, runs: 420, wickets: 0 },
            { name: 'Vijay Gurav', matchesPlayed: 12, runs: 85, wickets: 18 }
        ];
        await Player.insertMany(players);

        // 3. Add Fake Matches
        console.log('🏟️ Adding dummy matches...');
        const matches = [
            {
                season: 'GBPL 2024',
                teamA: 'Gurav Gladiators',
                teamB: 'Bandhu Blasters',
                scoreA: '145/6 (20)',
                scoreB: '142/9 (20)',
                result: 'Gurav Gladiators won by 3 runs',
                description: 'What a thriller! Amit Patil bowled a fantastic final over, defending 8 runs and taking 2 crucial wickets.'
            },
            {
                season: 'GBPL 2024',
                teamA: 'Shivaji Strikers',
                teamB: 'Pune Panthers',
                scoreA: '110/10 (18.4)',
                scoreB: '111/3 (15.2)',
                result: 'Pune Panthers won by 7 wickets',
                description: 'A comfortable chase for the Panthers. Rohan Kadam scored an unbeaten 65 off 40 balls.'
            }
        ];
        await Match.insertMany(matches);

        // 4. Add Fake Blogs
        console.log('📰 Adding dummy blogs...');
        const blogs = [
            {
                title: 'GBPL 2024 Mega Auction Completed!',
                imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&q=80',
                description: 'The auction for this year was a massive success. All 6 teams have finalized their squads. जीबीपीएल २०२४ चा लिलाव यशस्वीरीत्या पार पडला आहे. सर्व ६ संघांनी त्यांचे खेळाडू निवडले आहेत. आता प्रतीक्षा फक्त सामन्यांची!'
            },
            {
                title: 'Top 5 Players to Watch This Season',
                imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&q=80',
                description: 'With the season starting next week, experts are keeping a close eye on local talents like Rohan Kadam and Vijay Gurav.'
            }
        ];
        await Blog.insertMany(blogs);

        console.log('🎉 Database seeded successfully!');
        process.exit(); // Close the script
    } catch (err) {
        console.error('❌ Error seeding data:', err);
        process.exit(1);
    }
};

// Run the function
seedData();