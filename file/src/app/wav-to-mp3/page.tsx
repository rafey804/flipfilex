import { Metadata } from 'next';
import WavToMp3Client from './WavToMp3Client';
import { getToolMetadata } from '@/lib/toolsConfig';

export const metadata: Metadata = getToolMetadata('wav-to-mp3') || {};

export default function WavToMp3Page() {
  return <WavToMp3Client />;
}