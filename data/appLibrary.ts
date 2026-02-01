
import { Globe, FileText, Table, Presentation, ListChecks, HardDrive, Video, Calendar, Layout, Code, Server, Cloud, Terminal, Cpu, PenTool, MessageSquare, Box, GitBranch, Database, Shield, Mail } from 'lucide-react';

export interface AppCategory {
    id: string;
    name: string;
    apps: AppDefinition[];
}

export interface AppDefinition {
    name: string;
    url: string;
    icon?: any;
}

export const APP_LIBRARY: AppCategory[] = [
    {
        id: 'google',
        name: 'Google Suite',
        apps: [
            { name: 'Google Search', url: 'https://google.com', icon: Globe },
            { name: 'Docs', url: 'https://docs.google.com', icon: FileText },
            { name: 'Sheets', url: 'https://sheets.google.com', icon: Table },
            { name: 'Slides', url: 'https://slides.google.com', icon: Presentation },
            { name: 'Forms', url: 'https://forms.google.com', icon: ListChecks },
            { name: 'Drive', url: 'https://drive.google.com', icon: HardDrive },
            { name: 'Meet', url: 'https://meet.google.com', icon: Video },
            { name: 'Calendar', url: 'https://calendar.google.com', icon: Calendar },
            { name: 'Keep', url: 'https://keep.google.com', icon: ListChecks },
            { name: 'Sites', url: 'https://sites.google.com', icon: Layout },
            { name: 'Colab', url: 'https://colab.research.google.com', icon: Code },
        ]
    },
    {
        id: 'microsoft',
        name: 'Microsoft 365',
        apps: [
            { name: 'See All Microsoft', url: 'https://www.office.com/apps', icon: Globe },
            { name: 'Word', url: 'https://word.office.com', icon: FileText },
            { name: 'Excel', url: 'https://excel.office.com', icon: Table },
            { name: 'PowerPoint', url: 'https://powerpoint.office.com', icon: Presentation },
            { name: 'OneNote', url: 'https://onenote.office.com', icon: FileText },
            { name: 'Outlook', url: 'https://outlook.office.com', icon: MessageSquare },
            { name: 'Teams', url: 'https://teams.microsoft.com', icon: MessageSquare },
            { name: 'OneDrive', url: 'https://onedrive.live.com', icon: Cloud },
            { name: 'Power BI', url: 'https://powerbi.microsoft.com', icon: Table },
            { name: 'Azure DevOps', url: 'https://dev.azure.com', icon: GitBranch },
        ]
    },
    {
        id: 'ai',
        name: 'AI Platforms',
        apps: [
            { name: 'ChatGPT', url: 'https://chat.openai.com', icon: MessageSquare },
            { name: 'Claude', url: 'https://claude.ai', icon: MessageSquare },
            { name: 'Gemini', url: 'https://gemini.google.com', icon: MessageSquare },
            { name: 'Copilot', url: 'https://copilot.microsoft.com', icon: MessageSquare },
            { name: 'Perplexity', url: 'https://perplexity.ai', icon: Globe },
            { name: 'DeepSeek', url: 'https://chat.deepseek.com', icon: Code },
            { name: 'Kimi AI', url: 'https://kimi.moonshot.cn', icon: MessageSquare },
            { name: 'Qwen', url: 'https://qwen.ai', icon: MessageSquare },
            { name: 'Baidu ERNIE', url: 'https://yiyan.baidu.com', icon: MessageSquare },
        ]
    },
    {
        id: 'dev_web',
        name: 'Cloud Dev',
        apps: [
            { name: 'GitHub Codespaces', url: 'https://github.com/codespaces', icon: Terminal },
            { name: 'Gitpod', url: 'https://gitpod.io', icon: Terminal },
            { name: 'Replit', url: 'https://replit.com', icon: Code },
            { name: 'StackBlitz', url: 'https://stackblitz.com', icon: Code },
            { name: 'CodeSandbox', url: 'https://codesandbox.io', icon: Box },
        ]
    },
    {
        id: 'aws',
        name: 'Amazon AWS',
        apps: [
            { name: 'AWS Console', url: 'https://console.aws.amazon.com', icon: Server },
            { name: 'Cloud9', url: 'https://aws.amazon.com/cloud9', icon: Terminal },
            { name: 'SageMaker', url: 'https://studio.sagemaker.aws', icon: Cpu },
            { name: 'Lambda', url: 'https://aws.amazon.com/lambda', icon: Code },
            { name: 'S3', url: 'https://aws.amazon.com/s3', icon: Database },
        ]
    },
    {
        id: 'datascience',
        name: 'Data Science',
        apps: [
            { name: 'Jupyter', url: 'https://jupyter.org/try', icon: Code },
            { name: 'Kaggle', url: 'https://www.kaggle.com/code', icon: Database },
            { name: 'Deepnote', url: 'https://deepnote.com', icon: FileText },
            { name: 'Observable', url: 'https://observablehq.com', icon: Table },
        ]
    },
    {
        id: 'git',
        name: 'Code Hosting',
        apps: [
            { name: 'GitHub', url: 'https://github.com', icon: GitBranch },
            { name: 'GitLab', url: 'https://gitlab.com', icon: GitBranch },
            { name: 'Bitbucket', url: 'https://bitbucket.org', icon: GitBranch },
            { name: 'SourceForge', url: 'https://sourceforge.net', icon: Server },
        ]
    },
    {
        id: 'writing',
        name: 'Publishing',
        apps: [
            { name: 'Medium', url: 'https://medium.com', icon: PenTool },
            { name: 'Substack', url: 'https://substack.com', icon: Mail },
            { name: 'Dev.to', url: 'https://dev.to', icon: Code },
            { name: 'Hashnode', url: 'https://hashnode.com', icon: Globe },
            { name: 'Notion', url: 'https://notion.so', icon: FileText },
        ]
    },
];
