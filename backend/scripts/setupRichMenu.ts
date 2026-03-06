import { Client, RichMenu } from '@line/bot-sdk';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const client = new Client({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
    channelSecret: process.env.LINE_CHANNEL_SECRET || '',
});

const richMenuObject: RichMenu = {
    size: {
        width: 2500,
        height: 843
    },
    selected: true,
    name: 'Main Menu',
    chatBarText: 'เมนูหลัก',
    areas: [
        {
            bounds: {
                x: 0,
                y: 0,
                width: 833,
                height: 843
            },
            action: {
                type: 'message',
                text: 'จองคิว'
            }
        },
        {
            bounds: {
                x: 833,
                y: 0,
                width: 833,
                height: 843
            },
            action: {
                type: 'message',
                text: 'เช็คคิวว่าง'
            }
        },
        {
            bounds: {
                x: 1666,
                y: 0,
                width: 834,
                height: 843
            },
            action: {
                type: 'message',
                text: 'คิวของฉัน'
            }
        }
    ]
};

async function setupRichMenu() {
    try {
        console.log('1. Creating Rich Menu...');
        const richMenuId = await client.createRichMenu(richMenuObject);
        console.log('   Rich Menu ID:', richMenuId);

        console.log('2. Uploading Image...');
        const imagePath = path.join(__dirname, '../rich_menu.png');
        const imageBuffer = fs.readFileSync(imagePath);

        await client.setRichMenuImage(richMenuId, imageBuffer);
        console.log('   Image Uploaded!');

        console.log('3. Setting as Default...');
        await client.setDefaultRichMenu(richMenuId);
        console.log('   Rich Menu Set as Default!');

        console.log('✅ Setup Complete!');
    } catch (error: any) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

setupRichMenu();
