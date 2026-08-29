import React from 'react';
import { KaushalVoiceSearch, KaushalVoiceSearchProps } from './KaushalVoiceSearch';

export type VoiceSearchModalProps = KaushalVoiceSearchProps;

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = (props) => {
  return <KaushalVoiceSearch {...props} />;
};

export { KaushalVoiceSearch };
