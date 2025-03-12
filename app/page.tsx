import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PricingCardProps {
    title: string;
    price: string;
    features: string[];
}

interface BenefitCardProps {
    title: string;
    description: string;
}

export default function Home() {
    return (
        <div className='grid grid-rows-[auto_1fr_auto] items-center bg-background/10 justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
            {/* Hero Section */}
            <section className='text-center space-y-4 max-w-2xl'>
                <h1 className='text-4xl font-bold'>
                    Manage Your Finances with Finovate
                </h1>
                <p className='text-lg text-muted-foreground'>
                    Track your expenses, analyze spending habits, and take
                    control of your financial future. Whether you&apose;re
                    saving for a big purchase, paying off debt, or just trying
                    to understand where your money goes, Finovate is here to
                    help.
                </p>
                <Button size='lg'>Get Started</Button>
            </section>

            {/* About AI Features */}
            <section className='max-w-3xl text-center space-y-6'>
                <h2 className='text-3xl font-semibold'>
                    AI-Powered Financial Insights
                </h2>
                <p className='text-muted-foreground'>
                    Finovate leverages cutting-edge artificial intelligence to
                    analyze your spending patterns, identify trends, and suggest
                    actionable ways to save more efficiently. Our AI adapts to
                    your financial behavior, providing personalized insights
                    that evolve as your financial situation changes.
                </p>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='p-4 border rounded-lg'>
                        <h3 className='text-xl font-semibold'>
                            Real-Time Analysis
                        </h3>
                        <p className='text-sm text-muted-foreground'>
                            Get instant feedback on your spending habits as soon
                            as transactions occur.
                        </p>
                    </div>
                    <div className='p-4 border rounded-lg'>
                        <h3 className='text-xl font-semibold'>
                            Predictive Insights
                        </h3>
                        <p className='text-sm text-muted-foreground'>
                            Our AI predicts future spending trends and helps you
                            plan accordingly.
                        </p>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className='grid gap-8 sm:grid-cols-3 w-full max-w-4xl text-center'>
                <BenefitCard
                    title='Smart Budgeting'
                    description='Set budgets and get AI-driven recommendations to optimize your savings. Our system automatically adjusts your budget based on your spending behavior.'
                />
                <BenefitCard
                    title='Expense Tracking'
                    description='Automatically categorize expenses and view insightful reports. Track your spending across multiple accounts in one place.'
                />
                <BenefitCard
                    title='Secure & Private'
                    description='Your financial data is encrypted and never shared. We use bank-level security to ensure your information is safe.'
                />
            </section>

            {/* How It Works Section */}
            <section className='max-w-3xl text-center space-y-6'>
                <h2 className='text-3xl font-semibold'>How It Works</h2>
                <ul className='space-y-4 text-lg text-muted-foreground'>
                    <li>
                        <strong>1. Connect Your Accounts:</strong> Securely sync
                        your bank accounts, credit cards, and investment
                        accounts in just a few clicks.
                    </li>
                    <li>
                        <strong>2. AI Analysis:</strong> Our AI categorizes your
                        spending, identifies trends, and provides actionable
                        insights to help you save more.
                    </li>
                    <li>
                        <strong>3. Take Control:</strong> Use custom reports,
                        budgeting tools, and financial forecasts to make smarter
                        decisions and achieve your financial goals.
                    </li>
                </ul>
                <Button size='lg'>Learn More</Button>
            </section>

            {/* Pricing Section */}
            <section className='grid gap-8 sm:grid-cols-3 w-full max-w-4xl'>
                <PricingCard
                    title='Free'
                    price='$0'
                    features={[
                        "Basic Expense Tracking",
                        "Limited Reports",
                        "Email Support",
                    ]}
                />
                <PricingCard
                    title='Pro'
                    price='$19'
                    features={[
                        "Advanced Analytics",
                        "Unlimited Reports",
                        "Priority Support",
                        "Custom Budgets",
                    ]}
                />
                <PricingCard
                    title='Turbo'
                    price='$27'
                    features={[
                        "AI Insights",
                        "Collaborative Features",
                        "Custom Export Options",
                        "Dedicated Account Manager",
                    ]}
                />
            </section>

            {/* Testimonials Section */}
            <section className='max-w-3xl text-center space-y-6'>
                <h2 className='text-3xl font-semibold'>What Our Users Say</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='p-4 border rounded-lg'>
                        <p className='text-sm text-muted-foreground'>
                            &ldquo;Finovate has completely transformed how I
                            manage my finances. The AI insights are incredibly
                            accurate and have helped me save hundreds of
                            dollars!&rdquo;
                        </p>
                        <p className='mt-2 text-sm font-semibold'>- Sarah L.</p>
                    </div>
                    <div className='p-4 border rounded-lg'>
                        <p className='text-sm text-muted-foreground'>
                            &ldquo;I love how easy it is to track my expenses
                            and set budgets. The reports are so detailed and
                            easy to understand.&rdquo;
                        </p>
                        <p className='mt-2 text-sm font-semibold'>- John D.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className='text-center text-sm text-muted-foreground'>
                Made by Hardik | &copy; {new Date().getFullYear()} Finovate. All
                Rights Reserved.
            </footer>
        </div>
    );
}

function PricingCard({ title, price, features }: PricingCardProps) {
    return (
        <Card className='p-6 text-center'>
            <CardHeader>
                <CardTitle className='text-2xl font-bold'>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className='text-3xl font-semibold'>{price}/mo</p>
                <ul className='mt-4 space-y-2 text-sm text-muted-foreground'>
                    {features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                    ))}
                </ul>
                <Button className='mt-6 w-full'>Choose Plan</Button>
            </CardContent>
        </Card>
    );
}

function BenefitCard({ title, description }: BenefitCardProps) {
    return (
        <Card className='p-6 text-center'>
            <CardHeader>
                <CardTitle className='text-xl font-semibold'>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className='text-sm text-muted-foreground'>{description}</p>
            </CardContent>
        </Card>
    );
}
